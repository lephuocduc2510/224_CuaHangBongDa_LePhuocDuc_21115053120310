import { Router } from 'express';
import * as VaiTroController from '../../controllers/admin/vaiTro.controller';

const router = Router();

// Lấy tất cả vai trò
router.get('/', VaiTroController.getAllVaiTro);
// Lấy vai trò theo ID
router.get('/:id', VaiTroController.getVaiTroById);
// Tạo vai trò mới
router.post('/', VaiTroController.createVaiTro);
// Cập nhật vai trò theo ID
router.put('/:id', VaiTroController.updateVaiTro);
// Xóa vai trò theo ID
router.delete('/:id', VaiTroController.deleteVaiTro);

export default router;
