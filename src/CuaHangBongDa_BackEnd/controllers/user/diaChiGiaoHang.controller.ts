import { Request, Response } from 'express';
import * as DiaChiGiaoHangService from '../../services/diaChiGiaoHang.service';

// Lấy tất cả địa chỉ giao hàng
export const getAllDiaChiGiaoHang = async (req: Request, res: Response) => {
  try {
    const diaChis = await DiaChiGiaoHangService.getAllDiaChiGiaoHang();
    res.status(200).json(diaChis);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy địa chỉ giao hàng theo ID
export const getDiaChiGiaoHangById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diaChi = await DiaChiGiaoHangService.getDiaChiGiaoHangById(Number(id));

    if (!diaChi) {
      return res.status(404).json({ message: 'Địa chỉ giao hàng không tồn tại' });
    }

    res.status(200).json(diaChi);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy địa chỉ giao hàng theo người dùng
export const getDiaChiGiaoHangByNguoiDung = async (req: Request, res: Response) => {
  try {
    const { maNguoiDung } = req.params;
    const diaChis = await DiaChiGiaoHangService.getDiaChiGiaoHangByNguoiDung(Number(maNguoiDung));
    res.status(200).json(diaChis);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo địa chỉ giao hàng mới
export const createDiaChiGiaoHang = async (req: Request, res: Response) => {
  try {
    const diaChi = await DiaChiGiaoHangService.createDiaChiGiaoHang(req.body);
    res.status(201).json(diaChi);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật địa chỉ giao hàng theo ID
export const updateDiaChiGiaoHang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const diaChi = await DiaChiGiaoHangService.updateDiaChiGiaoHang(Number(id), req.body);

    if (!diaChi) {
      return res.status(404).json({ message: 'Địa chỉ giao hàng không tồn tại' });
    }

    res.status(200).json(diaChi);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa địa chỉ giao hàng theo ID
export const deleteDiaChiGiaoHang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await DiaChiGiaoHangService.deleteDiaChiGiaoHang(Number(id));

    if (!result.affected) {
      return res.status(404).json({ message: 'Địa chỉ giao hàng không tồn tại' });
    }

    res.status(200).json({ message: 'Địa chỉ giao hàng đã được xóa thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Đặt địa chỉ mặc định
export const setDiaChiMacDinh = async (req: Request, res: Response) => {
  try {
    const { id, maNguoiDung } = req.params;
    
    await DiaChiGiaoHangService.setDiaChiMacDinh(Number(id), Number(maNguoiDung));
    
    res.status(200).json({ message: 'Đã đặt địa chỉ giao hàng làm mặc định' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};