import { Router } from 'express';
import * as diaChinhController from '../../controllers/admin/diaChi.controller';

const router = Router();

// API Tỉnh/Thành phố
router.get('/tinh-thanh', diaChinhController.getAllTinhThanh);
router.get('/tinh-thanh/:id', diaChinhController.getTinhThanhById);

// API Quận/Huyện
router.get('/quan-huyen', diaChinhController.getAllQuanHuyen);
router.get('/quan-huyen/:id', diaChinhController.getQuanHuyenById);
router.get('/tinh-thanh/:maTinhThanh/quan-huyen', diaChinhController.getQuanHuyenByTinhThanh);

// API Phường/Xã
router.get('/phuong-xa', diaChinhController.getAllPhuongXa);
router.get('/phuong-xa/:id', diaChinhController.getPhuongXaById);
router.get('/quan-huyen/:maQuanHuyen/phuong-xa', diaChinhController.getPhuongXaByQuanHuyen);

// API Lấy cấu trúc địa chính đầy đủ
router.get('/dia-chinh', diaChinhController.getDiaChinh);

// API Lấy địa chỉ đầy đủ theo mã
router.get('/dia-chi/:maTinh/:maHuyen/:maXa', diaChinhController.getDiaChiDayDu);

export default router;