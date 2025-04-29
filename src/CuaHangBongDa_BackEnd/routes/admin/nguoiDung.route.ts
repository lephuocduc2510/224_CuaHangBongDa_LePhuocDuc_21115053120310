import { Router } from 'express';
import * as nguoiDungController from '../../controllers/admin/nguoiDung.controller';

const router = Router();

router.get('/', nguoiDungController.getAll);
router.get('/:id', nguoiDungController.getById);
router.post('/', nguoiDungController.create);
router.put('/:id', nguoiDungController.update);
router.delete('/:id', nguoiDungController.remove);

export default router;