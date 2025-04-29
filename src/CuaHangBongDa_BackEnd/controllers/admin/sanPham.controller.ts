// src/controllers/admin/sanPham.controller.ts
import { Request, Response } from 'express';
import * as sanPhamService from '../../services/sanPham.service';

export const getAllSanPham = async (req: Request, res: Response) => {
  try {
    const data = await sanPhamService.getAllSanPham();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: err.message });
  }
};

export const getSanPhamById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const sp = await sanPhamService.getSanPhamById(id);
    if (!sp) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(sp);
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm', error: err.message });
  }
};

export const createSanPham = async (req: Request, res: Response) => {
  try {
    const newSP = await sanPhamService.createSanPham(req.body);
    res.status(201).json(newSP);
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: err.message });
  }
};

export const updateSanPham = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await sanPhamService.updateSanPham(id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: err.message });
  }
};

export const deleteSanPham = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await sanPhamService.deleteSanPham(id);
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err: any) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
  }
};