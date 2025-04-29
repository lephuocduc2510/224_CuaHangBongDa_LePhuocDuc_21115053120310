import { Request, Response } from 'express';
import * as donHangService from '../../services/donHang.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await donHangService.getAllDonHang();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await donHangService.getDonHangById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await donHangService.createDonHang(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await donHangService.updateDonHang(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await donHangService.deleteDonHang(Number(req.params.id));
    res.json({ message: 'Xóa thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getByNguoiDung = async (req: Request, res: Response) => {
  try {
    const maNguoiDung = Number(req.params.maNguoiDung);
    const result = await donHangService.getDonHangByNguoiDung(maNguoiDung);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};