import { AppDataSource } from '../data-source';
import { MAUSAC } from '../entities/mauSac.entity';

const repo = AppDataSource.getRepository(MAUSAC);

export const getAllMauSac = async () => {
  return await repo.find();
};

export const getMauSacById = async (id: number) => {
  return await repo.findOne({ where: { id } });
};

export const createMauSac = async (data: Partial<MAUSAC>) => {
  const mauSac = repo.create(data);
  return await repo.save(mauSac);
};

export const updateMauSac = async (id: number, data: Partial<MAUSAC>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteMauSac = async (id: number) => {
  return await repo.delete(id);
};