// src/services/sanPham.service.ts
import { AppDataSource } from '../data-source';
import { SANPHAM } from '../entities/sanPham.entity';
import { SANPHAM_CHITIET } from '../entities/chiTietSanPham.entity';
import { Not } from 'typeorm';

const repo = AppDataSource.getRepository(SANPHAM);
const chiTietRepo = AppDataSource.getRepository(SANPHAM_CHITIET);

export const getAllSanPham = async () => {
  return await repo.find({
    relations: ['danhMuc', 'nhaSanXuat', 'phuongTienSanPham', 'sanPhamChiTiet', 'danhGias']
  });
};

export const getSanPhamById = async (id: number) => {
  // Lấy thông tin sản phẩm với các relations an toàn
  const sanPham = await repo.findOne({
    where: { id },
    relations: ['danhMuc', 'nhaSanXuat', 'phuongTienSanPham', 'danhGias']
  });

  if (!sanPham) {
    return null;
  }

  // Lấy riêng chi tiết sản phẩm
  const chiTiet = await chiTietRepo.find({
    where: { maSanPham: id },
    relations: ['mauSac', 'kichCo']
  });

  // Gán chi tiết vào đối tượng sản phẩm
  sanPham.sanPhamChiTiet = chiTiet;

  return sanPham;
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
  console.log(sanPham);

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



// Thêm vào cuối file, sau các hàm hiện có

// ========== QUẢN LÝ CHI TIẾT SẢN PHẨM ==========

export const getChiTietSanPhamBySanPhamId = async (sanPhamId: number) => {
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await repo.findOne({ where: { id: sanPhamId } });
  if (!sanPham) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Lấy chi tiết sản phẩm
  return await chiTietRepo.find({
    where: { maSanPham: sanPhamId },
    relations: ['mauSac', 'kichCo']
  });
};

export const createChiTietSanPham = async (sanPhamId: number, data: any) => {
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await repo.findOne({ where: { id: sanPhamId } });
 
  if (!sanPham) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Kiểm tra đã tồn tại chi tiết sản phẩm với màu sắc và kích cỡ này chưa
  const existingChiTiet = await chiTietRepo.findOne({
    where: {
      maSanPham: sanPhamId,
      maMauSac: data.maMauSac,
      maKichCo: data.maKichCo
    }
  });

  if (existingChiTiet) {
    throw new Error('Chi tiết sản phẩm với màu sắc và kích cỡ này đã tồn tại');
  }

  // Tạo chi tiết sản phẩm mới
  const chiTiet = chiTietRepo.create({
    ...data,
    maSanPham: sanPhamId
  });

  return await chiTietRepo.save(chiTiet);
};

export const updateChiTietSanPham = async (chiTietId: number, data: any) => {
  // Kiểm tra chi tiết sản phẩm tồn tại
  const chiTiet = await chiTietRepo.findOne({ where: { id: chiTietId } });
  if (!chiTiet) {
    throw new Error('Không tìm thấy chi tiết sản phẩm');
  }

  // Nếu cập nhật màu sắc và kích cỡ, kiểm tra trùng lặp
  if (data.maMauSac && data.maKichCo) {
    const existingChiTiet = await chiTietRepo.findOne({
      where: {
        maSanPham: chiTiet.maSanPham,
        maMauSac: data.maMauSac,
        maKichCo: data.maKichCo,
        id: Not(chiTietId) // Loại trừ chính nó
      }
    });

    if (existingChiTiet) {
      throw new Error('Chi tiết sản phẩm với màu sắc và kích cỡ này đã tồn tại');
    }
  }

  // Cập nhật chi tiết sản phẩm
  await chiTietRepo.update(chiTietId, data);

  // Trả về chi tiết sản phẩm sau khi cập nhật
  return await chiTietRepo.findOne({ 
    where: { id: chiTietId },
    relations: ['mauSac', 'kichCo'] 
  });
};

export const deleteChiTietSanPham = async (chiTietId: number) => {
  // Kiểm tra chi tiết sản phẩm tồn tại
  const chiTiet = await chiTietRepo.findOne({ where: { id: chiTietId } });
  if (!chiTiet) {
    throw new Error('Không tìm thấy chi tiết sản phẩm');
  }

  // Xóa chi tiết sản phẩm
  await chiTietRepo.delete(chiTietId);

  return { message: 'Xóa chi tiết sản phẩm thành công' };
};

// ========== QUẢN LÝ PHƯƠNG TIỆN SẢN PHẨM ==========

export const getPhuongTienSanPhamBySanPhamId = async (sanPhamId: number) => {
  // Kiểm tra sản phẩm tồn tại
  const sanPham = await repo.findOne({ where: { id: sanPhamId } });
  if (!sanPham) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Import repository phương tiện sản phẩm
  const phuongTienRepo = AppDataSource.getRepository('PHUONGTIENSANPHAM');

  // Lấy danh sách phương tiện sản phẩm
  return await phuongTienRepo.find({
    where: { maSanPham: sanPhamId },
    order: { laPhuongTienChinh: 'DESC' }
  });
};