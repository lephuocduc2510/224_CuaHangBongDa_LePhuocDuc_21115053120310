// src/services/sanPham.service.ts
import { AppDataSource } from '../data-source';
import { SANPHAM } from '../entities/sanPham.entity';
import { SANPHAM_CHITIET } from '../entities/chiTietSanPham.entity';

const repo = AppDataSource.getRepository(SANPHAM);
const chiTietRepo = AppDataSource.getRepository(SANPHAM_CHITIET);

export const getAllSanPham = async () => {
  return await repo.find({
    relations: ['danhMuc', 'nhaSanXuat', 'phuongTienSanPham', 'sanPhamChiTiet', 'danhGias']
  });
};

export const getSanPhamById = async (id: number) => {
  return await repo.findOne({
    where: { id },
    relations: ['danhMuc', 'nhaSanXuat', 'phuongTienSanPham', 'sanPhamChiTiet', 'danhGias']
  });
};

export const createSanPham = async (data: any) => {
  // Tách dữ liệu thành thông tin sản phẩm và chi tiết sản phẩm
  const { chiTietSanPhams, ...sanPhamData } = data;
  
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Tạo sản phẩm mới
    const newSanPham = repo.create(sanPhamData as SANPHAM); ;
    const savedSanPham = await queryRunner.manager.save(newSanPham);
    
    // Tạo chi tiết sản phẩm nếu có
    if (chiTietSanPhams && Array.isArray(chiTietSanPhams) && chiTietSanPhams.length > 0) {
      const chiTietItems = chiTietSanPhams.map(item => ({
        ...item,
        maSanPham: savedSanPham.id
      }));
      
      await queryRunner.manager.save(SANPHAM_CHITIET, chiTietItems);
    }
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    // Trả về sản phẩm đầy đủ với chi tiết
    return await getSanPhamById(savedSanPham.id);
  } catch (error) {
    // Rollback khi có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const updateSanPham = async (id: number, data: any) => {
  // Tách dữ liệu thành thông tin sản phẩm và chi tiết sản phẩm
  const { chiTietSanPhams, ...sanPhamData } = data;
  
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await repo.findOne({ where: { id } });
  if (!sanPham) {
    throw new Error('Không tìm thấy sản phẩm');
  }
  
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Cập nhật thông tin sản phẩm
    await queryRunner.manager.update(SANPHAM, id, sanPhamData);
    
    // Cập nhật chi tiết sản phẩm nếu có
    if (chiTietSanPhams && Array.isArray(chiTietSanPhams)) {
      // Xóa chi tiết cũ
      await queryRunner.manager.delete(SANPHAM_CHITIET, { maSanPham: id });
      
      // Thêm chi tiết mới
      if (chiTietSanPhams.length > 0) {
        const chiTietItems = chiTietSanPhams.map(item => ({
          ...item,
          maSanPham: id
        }));
        
        await queryRunner.manager.save(SANPHAM_CHITIET, chiTietItems);
      }
    }
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    // Trả về sản phẩm đầy đủ với chi tiết
    return await getSanPhamById(id);
  } catch (error) {
    // Rollback khi có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const deleteSanPham = async (id: number) => {
  // Bắt đầu transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Xóa chi tiết sản phẩm trước
    await queryRunner.manager.delete(SANPHAM_CHITIET, { maSanPham: id });
    
    // Xóa sản phẩm
    await queryRunner.manager.delete(SANPHAM, id);
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    return { success: true, message: 'Xóa sản phẩm và chi tiết thành công' };
  } catch (error) {
    // Rollback khi có lỗi
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};