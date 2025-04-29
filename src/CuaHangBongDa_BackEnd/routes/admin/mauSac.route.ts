import { Router } from 'express';
import * as mauSacController from '../../controllers/admin/mauSac.controller';

const router = Router();

router.get('/', mauSacController.getAll);
router.get('/:id', mauSacController.getById);
router.post('/', mauSacController.create);
router.put('/:id', mauSacController.update);
router.delete('/:id', mauSacController.remove);

export default router;