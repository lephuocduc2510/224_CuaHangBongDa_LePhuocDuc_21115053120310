import { Request, Response } from 'express';
import * as mauSacService from '../../services/mauSac.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await mauSacService.getAllMauSac();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await mauSacService.getMauSacById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Màu sắc không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await mauSacService.createMauSac(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await mauSacService.updateMauSac(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await mauSacService.deleteMauSac(Number(req.params.id));
    res.json({ message: 'Xoá màu sắc thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};