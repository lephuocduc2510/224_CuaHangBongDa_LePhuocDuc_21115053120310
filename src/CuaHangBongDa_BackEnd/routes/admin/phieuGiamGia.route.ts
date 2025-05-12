import { Router } from 'express';
import * as phieuGiamGiaController from '../../controllers/admin/phieuGiamGia.controller';

const router = Router();

// Các route hiện có
router.get('/', phieuGiamGiaController.getAll);
router.get('/hieu-luc', phieuGiamGiaController.getHieuLuc);
router.get('/:id', phieuGiamGiaController.getById);
router.post('/', phieuGiamGiaController.create);
router.put('/:id', phieuGiamGiaController.update);
router.delete('/:id', phieuGiamGiaController.remove);
router.post('/:id/gan-khach-hang', phieuGiamGiaController.ganChoKhachHang);

// Các route cần thêm
router.get('/search', phieuGiamGiaController.searchPhieuGiamGia);
router.get('/khach-hang/:id', phieuGiamGiaController.getPhieuGiamGiaCuaKhachHang);
router.post('/su-dung', phieuGiamGiaController.suDungPhieuGiamGia);
router.delete('/:id/xoa-khach-hang', phieuGiamGiaController.xoaKhoiKhachHang);

export default router;