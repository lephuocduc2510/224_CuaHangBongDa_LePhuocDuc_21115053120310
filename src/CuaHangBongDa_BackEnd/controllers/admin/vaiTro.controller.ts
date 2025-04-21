import { Request, Response } from 'express';
import * as VaiTroService from '../../services/vaiTro.service';

// Lấy tất cả vai trò
export const getAllVaiTro = async (req: Request, res: Response) => {
  try {
    const vaiTros = await VaiTroService.getAllVaiTro();
    res.status(200).json(vaiTros);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy vai trò theo ID
export const getVaiTroById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vaiTro = await VaiTroService.getVaiTroById(Number(id));

    if (!vaiTro) {
      return res.status(404).json({ message: 'Vai trò không tồn tại' });
    }

    res.status(200).json(vaiTro);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo vai trò mới
export const createVaiTro = async (req: Request, res: Response) => {
  try {
    const vaiTro = await VaiTroService.createVaiTro(req.body);
    res.status(201).json(vaiTro);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật vai trò theo ID
export const updateVaiTro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vaiTro = await VaiTroService.updateVaiTro(Number(id), req.body);

    if (!vaiTro) {
      return res.status(404).json({ message: 'Vai trò không tồn tại' });
    }

    res.status(200).json(vaiTro);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa vai trò theo ID
export const deleteVaiTro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vaiTro = await VaiTroService.deleteVaiTro(Number(id));

    if (!vaiTro.affected) {
      return res.status(404).json({ message: 'Vai trò không tồn tại' });
    }

    res.status(200).json({ message: 'Vai trò đã được xóa thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
