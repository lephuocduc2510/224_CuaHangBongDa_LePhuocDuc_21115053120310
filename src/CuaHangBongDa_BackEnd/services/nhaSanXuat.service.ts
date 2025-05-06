import { AppDataSource } from '../data-source';
import { NHASANXUAT } from '../entities/nhaSanXuat.entity';


const repo = AppDataSource.getRepository(NHASANXUAT);

export const getAllNhaSanXuat = async () => {
  return await repo.find({
    relations: ['sanPhams']
  });
};

export const getNhaSanXuatById = async (id: number) => {
  return await repo.findOne({ 
    where: { id },
    relations: ['sanPhams']
  });
};

export const createNhaSanXuat = async (data: Partial<NHASANXUAT>) => {
  const nhaSanXuat = repo.create(data);
  return await repo.save(nhaSanXuat);
};

export const updateNhaSanXuat = async (id: number, data: Partial<NHASANXUAT>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteNhaSanXuat = async (id: number) => {
  return await repo.delete(id);
};