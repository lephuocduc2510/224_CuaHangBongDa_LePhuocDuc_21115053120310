import { Router } from 'express';
import * as kichCoController from '../../controllers/admin/kichCo.controller';

const router = Router();

router.get('/', kichCoController.getAll);
router.get('/:id', kichCoController.getById);
router.post('/', kichCoController.create);
router.put('/:id', kichCoController.update);
router.delete('/:id', kichCoController.remove);

export default router;