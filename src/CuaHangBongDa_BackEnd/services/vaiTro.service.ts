import { AppDataSource } from '../data-source';
import { VAITRO } from '../entities/vaiTro.entity';

const repo = AppDataSource.getRepository(VAITRO);

// Lấy tất cả vai trò
export const getAllVaiTro = async () => {
  return await repo.find({
    relations: ['nguoiDungs'], // Quan hệ với NGUOIDUNG
  });
};

// Lấy vai trò theo ID
export const getVaiTroById = async (id: number) => {
  return await repo.findOne({
    where: { id },
    relations: ['nguoiDungs'], // Quan hệ với NGUOIDUNG
  });
};

// Tạo vai trò mới
export const createVaiTro = async (data: Partial<VAITRO>) => {
  const vaiTro = repo.create(data);
  return await repo.save(vaiTro);
};

// Cập nhật vai trò theo ID
export const updateVaiTro = async (id: number, data: Partial<VAITRO>) => {
  await repo.update(id, data);
  return await repo.findOne({
    where: { id },
    relations: ['nguoiDungs'], // Quan hệ với NGUOIDUNG
  });
};

// Xóa vai trò theo ID
export const deleteVaiTro = async (id: number) => {
  return await repo.delete(id);
};
