import { Request, Response } from 'express';
import * as phieuGiamGiaService from '../../services/phieuGiamGia.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getAllPhieuGiamGia();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getPhieuGiamGiaById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Phiếu giảm giá không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.createPhieuGiamGia(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.updatePhieuGiamGia(Number(req.params.id), req.body);
    if (!result) return res.status(404).json({ message: 'Phiếu giảm giá không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await phieuGiamGiaService.deletePhieuGiamGia(Number(req.params.id));
    res.json({ message: 'Xóa thành công' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getHieuLuc = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getPhieuGiamGiaHieuLuc();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const ganChoKhachHang = async (req: Request, res: Response) => {
  try {
    const { maNguoiDung } = req.body;
    
    if (!maNguoiDung) {
      return res.status(400).json({ message: 'Thiếu thông tin mã người dùng' });
    }
    
    const result = await phieuGiamGiaService.ganPhieuGiamGiaChoKhachHang(
      Number(req.params.id),
      Number(maNguoiDung)
    );
    
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};