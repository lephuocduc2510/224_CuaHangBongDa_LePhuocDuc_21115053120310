import { Router } from 'express';
import * as nhaSanXuatController from '../../controllers/admin/nhaSanXuat.controller';

const router = Router();

router.get('/', nhaSanXuatController.getAll);
router.get('/:id', nhaSanXuatController.getById);
router.post('/', nhaSanXuatController.create);
router.put('/:id', nhaSanXuatController.update);
router.delete('/:id', nhaSanXuatController.remove);

export default router;