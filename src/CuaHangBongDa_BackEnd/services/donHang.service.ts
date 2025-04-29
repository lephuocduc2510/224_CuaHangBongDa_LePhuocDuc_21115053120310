import { AppDataSource } from '../data-source';
import { DONHANG } from '../entities/donHang.entity';
import { CHITIETDONHANG } from '../entities/chiTietDonHang.entity';

const donHangRepo = AppDataSource.getRepository(DONHANG);
const chiTietDonHangRepo = AppDataSource.getRepository(CHITIETDONHANG);

export const getAllDonHang = async () => {
  return await donHangRepo.find({
    relations: ['nguoiDung', 'chiTietDonHangs', 'chiTietDonHangs.sanPham']
  });
};

export const getDonHangById = async (id: number) => {
  return await donHangRepo.findOne({ 
    where: { id },
    relations: ['nguoiDung', 'chiTietDonHangs', 'chiTietDonHangs.sanPham']
  });
};

export const createDonHang = async (data: any) => {
  const { chiTietDonHangs, ...donHangData } = data;
  
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Tạo đơn hàng
    const donHang = donHangRepo.create(donHangData as Partial<DONHANG>);
    donHang.ngayDatHang = new Date(); // Mặc định là ngày hiện tại
    const savedDonHang = await queryRunner.manager.save(donHang);
    
    // Tạo chi tiết đơn hàng
    if (chiTietDonHangs && Array.isArray(chiTietDonHangs)) {
      const chiTietItems = chiTietDonHangs.map(item => ({
        ...item,
        maDonHang: savedDonHang.id
      }));
      
      await queryRunner.manager.save(CHITIETDONHANG, chiTietItems);
    }
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    return await getDonHangById(savedDonHang.id);
  } catch (error) {
    // Rollback nếu có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const updateDonHang = async (id: number, data: any) => {
  const { chiTietDonHangs, ...donHangData } = data;
  
  // Kiểm tra đơn hàng tồn tại
  const donHang = await donHangRepo.findOne({ where: { id } });
  if (!donHang) {
    throw new Error('Không tìm thấy đơn hàng');
  }
  
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Cập nhật thông tin đơn hàng
    await queryRunner.manager.update(DONHANG, id, donHangData);
    
    // Cập nhật chi tiết đơn hàng nếu có
    if (chiTietDonHangs && Array.isArray(chiTietDonHangs)) {
      // Xóa chi tiết cũ
      await queryRunner.manager.delete(CHITIETDONHANG, { maDonHang: id });
      
      // Thêm chi tiết mới
      const chiTietItems = chiTietDonHangs.map(item => ({
        ...item,
        maDonHang: id
      }));
      
      await queryRunner.manager.save(CHITIETDONHANG, chiTietItems);
    }
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    return await getDonHangById(id);
  } catch (error) {
    // Rollback nếu có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const deleteDonHang = async (id: number) => {
  // Kiểm tra đơn hàng tồn tại
  const donHang = await donHangRepo.findOne({ where: { id } });
  if (!donHang) {
    throw new Error('Không tìm thấy đơn hàng');
  }
  
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Xóa chi tiết đơn hàng trước
    await queryRunner.manager.delete(CHITIETDONHANG, { maDonHang: id });
    
    // Xóa đơn hàng
    await queryRunner.manager.delete(DONHANG, id);
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    return { success: true, message: 'Xóa đơn hàng thành công' };
  } catch (error) {
    // Rollback nếu có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getDonHangByNguoiDung = async (maNguoiDung: number) => {
  return await donHangRepo.find({
    where: { maNguoiDung },
    relations: ['nguoiDung', 'chiTietDonHangs', 'chiTietDonHangs.sanPham']
  });
};