import { Router } from 'express';
import * as nguoiDungController from '../../controllers/admin/nguoiDung.controller';

const router = Router();

router.get('/', nguoiDungController.getAll);
router.get('/:id', nguoiDungController.getById);
router.post('/', nguoiDungController.create);
router.put('/:id', nguoiDungController.update);
router.delete('/:id', nguoiDungController.remove);
router.get('/:id/diachi', nguoiDungController.getDiaChiGiaoHangByNguoiDungId);

// Lấy chi tiết người dùng kèm danh sách địa chỉ giao hàng
router.get('/:id/chitiet-diachi', nguoiDungController.getNguoiDungWithDiaChiGiaoHang);

// Xóa tất cả địa chỉ giao hàng của người dùng
router.delete('/:id/diachi', nguoiDungController.deleteAllDiaChiGiaoHangByNguoiDungId);
export default router;