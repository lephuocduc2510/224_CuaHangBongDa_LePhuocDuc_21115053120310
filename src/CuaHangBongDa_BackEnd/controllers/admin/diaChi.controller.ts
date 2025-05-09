import { Request, Response } from 'express';
import * as diaChinhService from '../../services/diaChi.service';

// Lấy tất cả tỉnh/thành phố
export const getAllTinhThanh = async (req: Request, res: Response) => {
  try {
    const tinhThanhs = await diaChinhService.getAllTinhThanh();
    res.status(200).json(tinhThanhs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết tỉnh/thành phố theo ID
export const getTinhThanhById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tinhThanh = await diaChinhService.getTinhThanhById(Number(id));
    
    if (!tinhThanh) {
      return res.status(404).json({ message: 'Không tìm thấy tỉnh/thành phố' });
    }
    
    res.status(200).json(tinhThanh);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả quận/huyện
export const getAllQuanHuyen = async (req: Request, res: Response) => {
  try {
    const quanHuyens = await diaChinhService.getAllQuanHuyen();
    res.status(200).json(quanHuyens);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy quận/huyện theo tỉnh/thành phố
export const getQuanHuyenByTinhThanh = async (req: Request, res: Response) => {
  try {
    const { maTinhThanh } = req.params;
    const quanHuyens = await diaChinhService.getQuanHuyenByTinhThanh(Number(maTinhThanh));
    res.status(200).json(quanHuyens);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết quận/huyện theo ID
export const getQuanHuyenById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quanHuyen = await diaChinhService.getQuanHuyenById(Number(id));
    
    if (!quanHuyen) {
      return res.status(404).json({ message: 'Không tìm thấy quận/huyện' });
    }
    
    res.status(200).json(quanHuyen);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả phường/xã
export const getAllPhuongXa = async (req: Request, res: Response) => {
  try {
    const phuongXas = await diaChinhService.getAllPhuongXa();
    res.status(200).json(phuongXas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy phường/xã theo quận/huyện
export const getPhuongXaByQuanHuyen = async (req: Request, res: Response) => {
  try {
    const { maQuanHuyen } = req.params;
    const phuongXas = await diaChinhService.getPhuongXaByQuanHuyen(Number(maQuanHuyen));
    res.status(200).json(phuongXas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết phường/xã theo ID
export const getPhuongXaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const phuongXa = await diaChinhService.getPhuongXaById(Number(id));
    
    if (!phuongXa) {
      return res.status(404).json({ message: 'Không tìm thấy phường/xã' });
    }
    
    res.status(200).json(phuongXa);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy cấu trúc địa chính đầy đủ
export const getDiaChinh = async (req: Request, res: Response) => {
  try {
    const diaChinh = await diaChinhService.getDiaChinh();
    res.status(200).json(diaChinh);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy địa chỉ đầy đủ theo mã
export const getDiaChiDayDu = async (req: Request, res: Response) => {
  try {
    const { maTinh, maHuyen, maXa } = req.params;
    
    try {
      const diaChi = await diaChinhService.getDiaChiDayDu(
        Number(maTinh),
        Number(maHuyen),
        Number(maXa)
      );
      
      res.status(200).json(diaChi);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};