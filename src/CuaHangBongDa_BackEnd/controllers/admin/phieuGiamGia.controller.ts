import { Request, Response } from 'express';
import * as phieuGiamGiaService from '../../services/phieuGiamGia.service';

// Lấy tất cả phiếu giảm giá
export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getAllPhieuGiamGia();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy phiếu giảm giá theo ID
export const getById = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getPhieuGiamGiaById(Number(req.params.id));
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Phiếu giảm giá không tồn tại'
      });
    }
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tạo phiếu giảm giá mới
export const create = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.createPhieuGiamGia(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật phiếu giảm giá
export const update = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.updatePhieuGiamGia(Number(req.params.id), req.body);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Phiếu giảm giá không tồn tại'
      });
    }
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa phiếu giảm giá
export const remove = async (req: Request, res: Response) => {
  try {
    await phieuGiamGiaService.deletePhieuGiamGia(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Xóa phiếu giảm giá thành công'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy phiếu giảm giá còn hiệu lực
export const getHieuLuc = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.getPhieuGiamGiaHieuLuc();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Gán phiếu giảm giá cho khách hàng
export const ganChoKhachHang = async (req: Request, res: Response) => {
  try {
    const maPhieuGiamGia = Number(req.params.id);
    const { maNguoiDung, danhSachNguoiDung } = req.body;
    
    if (!maNguoiDung && (!danhSachNguoiDung || !Array.isArray(danhSachNguoiDung))) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp maNguoiDung hoặc danhSachNguoiDung'
      });
    }
    
    const result = await phieuGiamGiaService.ganPhieuGiamGiaChoKhachHang(
      maPhieuGiamGia,
      { maNguoiDung, danhSachNguoiDung }
    );
    
    res.status(200).json({
      success: true,
      message: 'Đã gán phiếu giảm giá cho khách hàng thành công',
      data: {
        soLuongGan: Array.isArray(result) ? result.length : 1,
        vouchers: result
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy phiếu giảm giá của khách hàng
export const getPhieuGiamGiaCuaKhachHang = async (req: Request, res: Response) => {
  try {
    const maNguoiDung = Number(req.params.id);
    const result = await phieuGiamGiaService.getPhieuGiamGiaCuaKhachHang(maNguoiDung);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tìm kiếm phiếu giảm giá
export const searchPhieuGiamGia = async (req: Request, res: Response) => {
  try {
    const result = await phieuGiamGiaService.searchPhieuGiamGia(req.query);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Thêm vào file phieuGiamGia.controller.ts
export const suDungPhieuGiamGia = async (req: Request, res: Response) => {
  try {
    const { maPhieuGiamGia, maNguoiDung } = req.body;
    
    if (!maPhieuGiamGia || !maNguoiDung) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin mã phiếu giảm giá hoặc mã người dùng'
      });
    }
    
    const result = await phieuGiamGiaService.suDungPhieuGiamGia(maPhieuGiamGia, maNguoiDung);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// Xóa phiếu giảm giá khỏi khách hàng
export const xoaKhoiKhachHang = async (req: Request, res: Response) => {
  try {
    const maPhieuGiamGia = Number(req.params.id);
    const { maNguoiDung, danhSachNguoiDung } = req.body;
    
    if (!maNguoiDung && (!danhSachNguoiDung || !Array.isArray(danhSachNguoiDung))) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp maNguoiDung hoặc danhSachNguoiDung'
      });
    }
    
    const result = await phieuGiamGiaService.xoaPhieuGiamGiaKhoiKhachHang(
      maPhieuGiamGia,
      { maNguoiDung, danhSachNguoiDung }
    );
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa phiếu giảm giá khỏi khách hàng thành công',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};