import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';

// Mở rộng interface Request để thêm thông tin người dùng
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware xác thực người dùng từ JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }
    
    // Xác thực token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    
    // Lưu thông tin người dùng vào request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Xác thực thất bại' });
  }
};

// Middleware kiểm tra quyền truy cập
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Không có thông tin người dùng' });
    }
    
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    
    next();
  };
};