// // auth.middleware.ts
// import { Request, Response, NextFunction } from 'express';

// // Giả sử bạn có một hệ thống token JWT hoặc session để lưu thông tin người dùng
// export const checkAuth = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const userRole = req.user?.role; // Lấy role từ token hoặc session

//     if (!userRole || userRole !== role) {
//       return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
//     }

//     next(); // Nếu người dùng có quyền, cho phép tiếp tục
//   };
// };
