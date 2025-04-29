import { Router } from 'express';
import * as nhaCungCapController from '../../controllers/admin/nhaCungCap.controller';

const router = Router();

router.get('/', nhaCungCapController.getAll);
router.get('/:id', nhaCungCapController.getById);
router.post('/', nhaCungCapController.create);
router.put('/:id', nhaCungCapController.update);
router.delete('/:id', nhaCungCapController.remove);

export default router;