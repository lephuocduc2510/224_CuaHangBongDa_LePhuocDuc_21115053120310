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

// Thêm vào cuối file, sau các hàm hiện có

// ========== QUẢN LÝ CHI TIẾT SẢN PHẨM ==========

export const getChiTietSanPhamBySanPhamId = async (req: Request, res: Response) => {
  try {
    const sanPhamId = Number(req.params.sanPhamId);
    
    // Kiểm tra ID hợp lệ
    if (isNaN(sanPhamId) || sanPhamId <= 0) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }
    
    const chiTietSanPhams = await sanPhamService.getChiTietSanPhamBySanPhamId(sanPhamId);
    res.json(chiTietSanPhams);
  } catch (err: any) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách chi tiết sản phẩm', 
      error: err.message 
    });
  }
};

export const createChiTietSanPham = async (req: Request, res: Response) => {
  try {
    const sanPhamId = Number(req.params.sanPhamId);
    
    // Kiểm tra ID hợp lệ
    if (isNaN(sanPhamId) || sanPhamId <= 0) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }
    
    const newChiTiet = await sanPhamService.createChiTietSanPham(sanPhamId, req.body);
    res.status(201).json(newChiTiet);
  } catch (err: any) {
    res.status(500).json({ 
      message: 'Lỗi khi tạo chi tiết sản phẩm', 
      error: err.message 
    });
  }
};

export const updateChiTietSanPham = async (req: Request, res: Response) => {
  try {
    const chiTietId = Number(req.params.chiTietId);
    
    // Kiểm tra ID hợp lệ
    if (isNaN(chiTietId) || chiTietId <= 0) {
      return res.status(400).json({ message: 'ID chi tiết sản phẩm không hợp lệ' });
    }
    
    const updatedChiTiet = await sanPhamService.updateChiTietSanPham(chiTietId, req.body);
    res.json(updatedChiTiet);
  } catch (err: any) {
    res.status(500).json({ 
      message: 'Lỗi khi cập nhật chi tiết sản phẩm', 
      error: err.message 
    });
  }
};

export const deleteChiTietSanPham = async (req: Request, res: Response) => {
  try {
    const chiTietId = Number(req.params.chiTietId);
    
    // Kiểm tra ID hợp lệ
    if (isNaN(chiTietId) || chiTietId <= 0) {
      return res.status(400).json({ message: 'ID chi tiết sản phẩm không hợp lệ' });
    }
    
    const result = await sanPhamService.deleteChiTietSanPham(chiTietId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ 
      message: 'Lỗi khi xóa chi tiết sản phẩm', 
      error: err.message 
    });
  }
};

// ========== QUẢN LÝ PHƯƠNG TIỆN SẢN PHẨM ==========

export const getPhuongTienSanPhamBySanPhamId = async (req: Request, res: Response) => {
  try {
    const sanPhamId = Number(req.params.sanPhamId);
    
    // Kiểm tra ID hợp lệ
    if (isNaN(sanPhamId) || sanPhamId <= 0) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }
    
    const phuongTiens = await sanPhamService.getPhuongTienSanPhamBySanPhamId(sanPhamId);
    res.json(phuongTiens);
  } catch (err: any) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách phương tiện sản phẩm', 
      error: err.message 
    });
  }
};