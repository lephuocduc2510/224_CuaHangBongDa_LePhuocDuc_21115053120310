import { AppDataSource } from '../data-source';
import { DANHMUC } from '../entities/danhMuc.entity';

const repo = AppDataSource.getRepository(DANHMUC);

export const getAllDanhMuc = async () => {
  return await repo.find();
};

export const getDanhMucById = async (id: number) => {
  return await repo.findOne({ where: { id } });
};

export const createDanhMuc = async (data: Partial<DANHMUC>) => {
  const danhMuc = repo.create(data);
  return await repo.save(danhMuc);
};

export const updateDanhMuc = async (id: number, data: Partial<DANHMUC>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteDanhMuc = async (id: number) => {
  return await repo.delete(id);
};
