import { Request, Response } from 'express';
import * as phuongTienService from '../../services/phuongTienSanPham.service';

// Lấy tất cả phương tiện của một sản phẩm
export const getPhuongTienBySanPham = async (req: Request, res: Response) => {
  try {
    const maSanPham = Number(req.params.maSanPham);
    const result = await phuongTienService.getPhuongTienBySanPham(maSanPham);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Thêm phương tiện (nhiều ảnh/video) cho sản phẩm
export const addMultiplePhuongTien = async (req: Request, res: Response) => {
    try {
      const maSanPham = Number(req.params.maSanPham);
      // Đảm bảo có files được upload
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ message: 'Không có file nào được tải lên' });
      }
  
      const files = req.files as Express.Multer.File[];
      const result = await phuongTienService.addMultiplePhuongTien(maSanPham, req.body, files);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

// Thêm phương tiện (ảnh/video) cho sản phẩm
export const addPhuongTien = async (req: Request, res: Response) => {
  try {
    const maSanPham = Number(req.params.maSanPham);
    // Đảm bảo có file được upload
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được tải lên' });
    }

    const result = await phuongTienService.addPhuongTien(maSanPham, req.body, req.file);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin phương tiện
export const updatePhuongTien = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await phuongTienService.updatePhuongTien(id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa phương tiện
export const deletePhuongTien = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await phuongTienService.deletePhuongTien(id);
    res.json({ message: 'Xóa phương tiện thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Đặt phương tiện chính
export const setPhuongTienChinh = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await phuongTienService.setPhuongTienChinh(id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};