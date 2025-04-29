import { AppDataSource } from '../data-source';
import { KICHCO } from '../entities/kichCo.entity';

const repo = AppDataSource.getRepository(KICHCO);

export const getAllKichCo = async () => {
  return await repo.find();
};

export const getKichCoById = async (id: number) => {
  return await repo.findOne({ where: { id } });
};

export const createKichCo = async (data: Partial<KICHCO>) => {
  const kichCo = repo.create(data);
  return await repo.save(kichCo);
};

export const updateKichCo = async (id: number, data: Partial<KICHCO>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteKichCo = async (id: number) => {
  return await repo.delete(id);
};