import { AppDataSource } from '../data-source';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';

const repo = AppDataSource.getRepository(NGUOIDUNG);

export const getAllNguoiDung = async () => {
  return await repo.find({
    relations: ['vaiTro', 'donHangs', 'gioHangs', 'danhGias']
  });
};

export const getNguoiDungById = async (id: number) => {
  return await repo.findOne({ 
    where: { id },
    relations: ['vaiTro', 'donHangs', 'gioHangs', 'danhGias']
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