import { AppDataSource } from '../data-source';
import { NHACUNGCAP } from '../entities/nhaCungCap.entity';

const repo = AppDataSource.getRepository(NHACUNGCAP);

export const getAllNhaCungCap = async () => {
  return await repo.find({
    relations: ['phieuNhaps']
  });
};

export const getNhaCungCapById = async (id: number) => {
  return await repo.findOne({ 
    where: { id },
    relations: ['phieuNhaps']
  });
};

export const createNhaCungCap = async (data: Partial<NHACUNGCAP>) => {
  const nhaCungCap = repo.create(data);
  return await repo.save(nhaCungCap);
};

export const updateNhaCungCap = async (id: number, data: Partial<NHACUNGCAP>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteNhaCungCap = async (id: number) => {
  return await repo.delete(id);
};