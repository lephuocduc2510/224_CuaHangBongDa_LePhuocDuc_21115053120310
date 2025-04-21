// src/routes/admin/sanPham.route.ts
import { Router } from 'express';
import * as sanPhamController from '../../controllers/admin/sanPham.controller';

const router = Router();

router.get('/', sanPhamController.getAllSanPham);
router.get('/:id', sanPhamController.getSanPhamById);
router.post('/', sanPhamController.createSanPham);
router.put('/:id', sanPhamController.updateSanPham);
router.delete('/:id', sanPhamController.deleteSanPham);

export default router;
