import { Request, Response } from 'express';
import * as nguoiDungService from '../../services/nguoiDung.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await nguoiDungService.getAllNguoiDung();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await nguoiDungService.getNguoiDungById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Người dùng không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await nguoiDungService.createNguoiDung(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await nguoiDungService.updateNguoiDung(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await nguoiDungService.deleteNguoiDung(Number(req.params.id));
    res.json({ message: 'Xoá thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};