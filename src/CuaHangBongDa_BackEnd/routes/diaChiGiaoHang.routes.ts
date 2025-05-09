import { Router } from 'express';
import * as DiaChiGiaoHangController from '../controllers/user/diaChiGiaoHang.controller';

const router = Router();

// Lấy tất cả địa chỉ giao hàng
router.get('/', DiaChiGiaoHangController.getAllDiaChiGiaoHang);

// Lấy địa chỉ giao hàng theo ID
router.get('/:id', DiaChiGiaoHangController.getDiaChiGiaoHangById);

// Lấy địa chỉ giao hàng theo người dùng
router.get('/nguoidung/:maNguoiDung', DiaChiGiaoHangController.getDiaChiGiaoHangByNguoiDung);

// Tạo địa chỉ giao hàng mới
router.post('/', DiaChiGiaoHangController.createDiaChiGiaoHang);

// Cập nhật địa chỉ giao hàng theo ID
router.put('/:id', DiaChiGiaoHangController.updateDiaChiGiaoHang);

// Xóa địa chỉ giao hàng theo ID
router.delete('/:id', DiaChiGiaoHangController.deleteDiaChiGiaoHang);

// Đặt địa chỉ làm mặc định
router.put('/:id/macdinh/:maNguoiDung', DiaChiGiaoHangController.setDiaChiMacDinh);

export default router;