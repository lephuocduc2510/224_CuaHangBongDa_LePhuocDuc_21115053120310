import { Router } from 'express';
import * as phieuGiamGiaController from '../../controllers/admin/phieuGiamGia.controller';

const router = Router();

router.get('/', phieuGiamGiaController.getAll);
router.get('/hieu-luc', phieuGiamGiaController.getHieuLuc);
router.get('/:id', phieuGiamGiaController.getById);
router.post('/', phieuGiamGiaController.create);
router.put('/:id', phieuGiamGiaController.update);
router.delete('/:id', phieuGiamGiaController.remove);
router.post('/:id/gan-khach-hang', phieuGiamGiaController.ganChoKhachHang);

export default router;