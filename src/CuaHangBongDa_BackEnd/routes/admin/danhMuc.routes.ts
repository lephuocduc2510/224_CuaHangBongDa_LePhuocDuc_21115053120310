import { Router } from 'express';
import * as danhMucController from '../../controllers/admin/danhMuc.controller';

const router = Router();

router.get('/', danhMucController.getAll);
router.get('/:id', danhMucController.getById);
router.post('/', danhMucController.create);
router.put('/:id', danhMucController.update);
router.delete('/:id', danhMucController.remove);

export default router;
