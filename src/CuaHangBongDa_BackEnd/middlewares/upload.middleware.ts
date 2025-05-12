import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { SANPHAM } from '../entities/sanPham.entity';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileFilterCallback } from 'multer';


const sanPhamRepo = AppDataSource.getRepository(SANPHAM);

// Helper để làm sạch tên file
export const sanitizeFileName = (name: string = ''): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

// Middleware để đổi tên file dựa trên tên sản phẩm
export const renameUploadedFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra xem có file được upload không
    if (!req.file) {
      return next();
    }
    
    const maSanPham = req.params.maSanPham;
    
    // Tìm thông tin sản phẩm
    const sanPham = await sanPhamRepo.findOne({ where: { id: Number(maSanPham) } });
    if (!sanPham) {
      return next();
    }
    
    // Lấy đường dẫn file hiện tại
    const oldPath = req.file.path;
    const fileDir = path.dirname(oldPath);
    const fileExt = path.extname(req.file.originalname);
    
    // Tạo tên file mới dựa trên tên sản phẩm
    const sanitizedProductName = sanitizeFileName(sanPham.tenSanPham);
    const sanitizedPTName = sanitizeFileName(req.body.tenPhuongTien || 'image');
    
    // Lấy UUID từ tên file cũ
    const currentFilename = path.basename(oldPath);
    const uuidPart = currentFilename.split('-').pop()?.split('.')[0] || '';
    
    // Tạo tên file mới
    const newFileName = `${sanitizedProductName}-${sanitizedPTName}-${uuidPart}${fileExt}`;
    const newPath = path.join(fileDir, newFileName);
    
    // Đổi tên file
    fs.renameSync(oldPath, newPath);
    
    // Cập nhật thông tin file trong request
    req.file.filename = newFileName;
    req.file.path = newPath;
    
    next();
  } catch (error) {
    console.error('Lỗi khi đổi tên file:', error);
    next();
  }
};

// Middleware để đổi tên nhiều file
export const renameUploadedFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Kiểm tra xem có files được upload không
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }
    
    const maSanPham = req.params.maSanPham;
    
    // Tìm thông tin sản phẩm
    const sanPham = await sanPhamRepo.findOne({ where: { id: Number(maSanPham) } });
    if (!sanPham) {
      return next();
    }
    
    // Làm sạch tên sản phẩm
    const sanitizedProductName = sanitizeFileName(sanPham.tenSanPham);
    const sanitizedPTName = sanitizeFileName(req.body.tenPhuongTien || 'image');
    
    // Đổi tên từng file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const oldPath = file.path;
      const fileDir = path.dirname(oldPath);
      const fileExt = path.extname(file.originalname);
      
      // Lấy UUID từ tên file cũ
      const currentFilename = path.basename(oldPath);
      const uuidPart = currentFilename.split('-').pop()?.split('.')[0] || '';
      
      // Tạo tên file mới
      const newFileName = `${sanitizedProductName}-${sanitizedPTName}-${i + 1}-${uuidPart}${fileExt}`;
      const newPath = path.join(fileDir, newFileName);
      
      // Đổi tên file
      fs.renameSync(oldPath, newPath);
      
      // Cập nhật thông tin file
      file.filename = newFileName;
      file.path = newPath;
    }
    
    next();
  } catch (error) {
    console.error('Lỗi khi đổi tên files:', error);
    next();
  }
};




// Multer để upload avatar

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo thư mục uploads/avatars nếu chưa tồn tại
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Tạo thư mục riêng cho user nếu cần
    if (req.user && req.user.id) {
      const userDir = path.join(uploadDir, req.user.id.toString());
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
      cb(null, userDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req: any, file: Express.Multer.File, cb: any) {
    // Đảm bảo tên file không trùng
    const fileExt = path.extname(file.originalname);
    const uniquePrefix = 'avatar-' + Date.now() + '-' + uuidv4().substring(0, 8);
    cb(null, uniquePrefix + fileExt);
  }
});

// Filter cho việc upload avatar
const avatarFileFilter = (
  req: any, 
  file: Express.Multer.File, 
  cb: FileFilterCallback
) => {
  // Chỉ chấp nhận các loại file ảnh
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)'));
  }
};

// Cấu hình multer cho avatar
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: avatarFileFilter
});