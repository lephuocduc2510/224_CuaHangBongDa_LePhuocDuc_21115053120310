import { Request, Response } from 'express';
import * as danhMucService from '../../services/danhMuc.service';

export const getAll = async (req: Request, res: Response) => {
  const result = await danhMucService.getAllDanhMuc();
  res.json(result);
};

export const getById = async (req: Request, res: Response) => {
  const result = await danhMucService.getDanhMucById(Number(req.params.id));
  if (!result) return res.status(404).json({ message: 'Danh mục không tồn tại' });
  res.json(result);
};

export const create = async (req: Request, res: Response) => {
  const result = await danhMucService.createDanhMuc(req.body);
  res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
  const result = await danhMucService.updateDanhMuc(Number(req.params.id), req.body);
  res.json(result);
};

export const remove = async (req: Request, res: Response) => {
  await danhMucService.deleteDanhMuc(Number(req.params.id));
  res.json({ message: 'Xoá thành công' });
};
