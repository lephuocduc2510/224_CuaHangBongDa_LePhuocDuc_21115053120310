// src/services/sanPham.service.ts
import { AppDataSource } from '../data-source';
import { SANPHAM } from '../entities/sanPham.entity';

const repo = AppDataSource.getRepository(SANPHAM);

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

export const createSanPham = async (data: Partial<SANPHAM>) => {
  const newSanPham = repo.create(data);
  return await repo.save(newSanPham);
};

export const updateSanPham = async (id: number, data: Partial<SANPHAM>) => {
  await repo.update(id, data);
  return await repo.findOne({ where: { id } });
};

export const deleteSanPham = async (id: number) => {
  return await repo.delete(id);
};
