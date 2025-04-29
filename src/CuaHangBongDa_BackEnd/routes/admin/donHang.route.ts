import { Router } from 'express';
import * as donHangController from '../../controllers/admin/donHang.controller';

const router = Router();

router.get('/', donHangController.getAll);
router.get('/:id', donHangController.getById);
router.post('/', donHangController.create);
router.put('/:id', donHangController.update);
router.delete('/:id', donHangController.remove);
router.get('/nguoidung/:maNguoiDung', donHangController.getByNguoiDung);

export default router;