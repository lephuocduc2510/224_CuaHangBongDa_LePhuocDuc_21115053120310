// Thêm imports
import { Router, Request, Response, NextFunction } from 'express';
import * as phuongTienController from '../../controllers/admin/phuongTienSanPham.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { renameUploadedFile, renameUploadedFiles } from '../../middlewares/upload.middleware';

// Helper để làm sạch tên file
const sanitizeFileName = (name: string = ''): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lấy maSanPham từ params
    const maSanPham = req.params.maSanPham;
    // Tạo đường dẫn thư mục theo maSanPham
    const uploadDir = path.join(__dirname, '../../public/uploads', maSanPham);
    
    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Lấy thông tin để đặt tên file
    const maSanPham = req.params.maSanPham;
    const tenPT = req.body.tenPhuongTien || 'image';
    
    // Tạo tên file
    const sanitizedPTName = sanitizeFileName(tenPT);
    const shortId = uuidv4().substring(0, 8);
    const fileExt = path.extname(file.originalname);
    
    // Tên file mới: [maSanPham]-[tenPhuongTien]-[uuid ngắn].[đuôi file]
    const fileName = `${maSanPham}-${sanitizedPTName}-${shortId}${fileExt}`;
    
    cb(null, fileName);
  }
});

// Kiểm tra loại file
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh hoặc video'));
  }
};

// Cấu hình middleware cho upload một file
const uploadSingleMiddleware = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');

// Cấu hình middleware cho upload nhiều file (tối đa 10 file)
const uploadMultipleMiddleware = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).array('files', 10);

// Middleware wrapper để xử lý lỗi khi upload một file
const handleSingleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadSingleMiddleware(req as any, res as any, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Lỗi khi tải file' });
    }
    next();
  });
};

// Middleware wrapper để xử lý lỗi khi upload nhiều file
const handleMultipleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadMultipleMiddleware(req as any, res as any, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Lỗi khi tải file' });
    }
    next();
  });
};

const router = Router();

// Routes
router.get('/sanpham/:maSanPham', phuongTienController.getPhuongTienBySanPham);
router.post('/sanpham/:maSanPham', handleSingleUpload, renameUploadedFile, phuongTienController.addPhuongTien);
router.post('/sanpham/:maSanPham/multiple', handleMultipleUpload, renameUploadedFiles, phuongTienController.addMultiplePhuongTien);
router.put('/:id', phuongTienController.updatePhuongTien);
router.delete('/:id', phuongTienController.deletePhuongTien);
router.put('/:id/set-main', phuongTienController.setPhuongTienChinh);

export default router;