import { Request, Response } from 'express';
import * as nhaCungCapService from '../../services/nhaCungCap.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await nhaCungCapService.getAllNhaCungCap();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await nhaCungCapService.getNhaCungCapById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Nhà cung cấp không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await nhaCungCapService.createNhaCungCap(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await nhaCungCapService.updateNhaCungCap(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await nhaCungCapService.deleteNhaCungCap(Number(req.params.id));
    res.json({ message: 'Xoá thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};