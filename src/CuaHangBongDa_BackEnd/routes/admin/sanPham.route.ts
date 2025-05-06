// src/routes/admin/sanPham.route.ts
import { Router } from 'express';
import * as sanPhamController from '../../controllers/admin/sanPham.controller';

const router = Router();

// Routes cho sản phẩm
router.get('/', sanPhamController.getAllSanPham);
router.get('/:id', sanPhamController.getSanPhamById);
router.post('/', sanPhamController.createSanPham);
router.put('/:id', sanPhamController.updateSanPham);
router.delete('/:id', sanPhamController.deleteSanPham);

// Routes cho chi tiết sản phẩm
router.get('/:sanPhamId/chitiet', sanPhamController.getChiTietSanPhamBySanPhamId);
router.post('/:sanPhamId/chitiet', sanPhamController.createChiTietSanPham);
router.put('/chitiet/:chiTietId', sanPhamController.updateChiTietSanPham);
router.delete('/chitiet/:chiTietId', sanPhamController.deleteChiTietSanPham);

// Routes cho phương tiện sản phẩm
router.get('/:sanPhamId/phuongtien', sanPhamController.getPhuongTienSanPhamBySanPhamId);

export default router;