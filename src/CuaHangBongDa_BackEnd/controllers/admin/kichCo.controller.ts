import { Request, Response } from 'express';
import * as kichCoService from '../../services/kichCo.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await kichCoService.getAllKichCo();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const result = await kichCoService.getKichCoById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: 'Kích cỡ không tồn tại' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await kichCoService.createKichCo(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await kichCoService.updateKichCo(Number(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await kichCoService.deleteKichCo(Number(req.params.id));
    res.json({ message: 'Xoá kích cỡ thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};