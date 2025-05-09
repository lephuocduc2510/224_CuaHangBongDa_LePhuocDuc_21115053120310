import { AppDataSource } from '../data-source';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';

const repo = AppDataSource.getRepository(NGUOIDUNG);
const diaChiRepo = AppDataSource.getRepository('DIACHI_GIAOHANG'); // Đảm bảo rằng bạn đã định nghĩa DIACHI_GIAOHANG trong entities

export const getAllNguoiDung = async () => {
  return await repo.find({
    relations: ['vaiTro', 'donHangs', 'gioHangs', 'danhGias', 'diaChiGiaoHang'],
  });
};

export const getNguoiDungById = async (id: number) => {
  return await repo.findOne({ 
    where: { id },
    relations: ['vaiTro', 'donHangs', 'gioHangs', 'danhGias', 'diaChiGiaoHang'],
  });
};

export const createNguoiDung = async (data: Partial<NGUOIDUNG>) => {
  const nguoiDung = repo.create(data);
  return await repo.save(nguoiDung);
};

export const updateNguoiDung = async (id: number, data: Partial<NGUOIDUNG>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteNguoiDung = async (id: number) => {
  return await repo.delete(id);
};


export const getDiaChiGiaoHangByNguoiDungId = async (maNguoiDung: number) => {
  return await diaChiRepo.find({
    where: { maNguoiDung },
    relations: ['tinhThanhPho', 'quanHuyen', 'phuongXa'],
    order: {
      laDiaChiMacDinh: 'DESC',
      ngayTao: 'DESC'
    }
  });
};

// Thêm mới: Lấy chi tiết người dùng bao gồm danh sách địa chỉ giao hàng
export const getNguoiDungWithDiaChiGiaoHang = async (id: number) => {
  const nguoiDung = await repo.findOne({
    where: { id },
    relations: ['vaiTro', 'donHangs', 'gioHangs', 'danhGias']
  });

  if (!nguoiDung) return null;

  // Lấy danh sách địa chỉ giao hàng
  const diaChiGiaoHangs = await diaChiRepo.find({
    where: { maNguoiDung: id },
    relations: ['tinhThanhPho', 'quanHuyen', 'phuongXa'],
    order: {
      laDiaChiMacDinh: 'DESC',
      ngayTao: 'DESC'
    }
  });

  // Thêm danh sách địa chỉ vào đối tượng người dùng
  return {
    ...nguoiDung,
    diaChiGiaoHangs
  };
};

// Thêm mới: Xóa tất cả địa chỉ giao hàng của người dùng
export const deleteAllDiaChiGiaoHangByNguoiDungId = async (maNguoiDung: number) => {
  return await diaChiRepo.delete({ maNguoiDung });
};