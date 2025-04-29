import { Request, Response } from 'express';
import * as nhaSanXuatService from '../../services/nhaSanXuat.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await nhaSanXuatService.getAllNhaSanXuat();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await nhaSanXuatService.getNhaSanXuatById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Nhà sản xuất không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await nhaSanXuatService.createNhaSanXuat(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await nhaSanXuatService.updateNhaSanXuat(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await nhaSanXuatService.deleteNhaSanXuat(Number(req.params.id));
    res.json({ message: 'Xoá thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};