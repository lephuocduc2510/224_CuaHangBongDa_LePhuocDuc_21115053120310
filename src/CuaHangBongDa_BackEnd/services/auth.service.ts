import { AppDataSource } from '../data-source';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.utils';

const userRepo = AppDataSource.getRepository(NGUOIDUNG);

// Mã hóa mật khẩu
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// So sánh mật khẩu
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Đăng ký người dùng mới
export const register = async (userData: any) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await userRepo.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Hash password trước khi lưu
  const hashedPassword = await hashPassword(userData.password || userData.matKhau);
  
  // Tạo user mới
  const newUser = userRepo.create({
    ...userData,
    matKhau: hashedPassword,
    maVaiTro: userData.maVaiTro || 2, // Mặc định là vai trò khách hàng
    ngayDoiMatKhau: new Date(),
    tokenDatLaiMatKhau: '',
    tokenHetHan: new Date()
  });
  
  // Lưu user mới
  return await userRepo.save(newUser);
};

// Đăng nhập
export const login = async (email: string, password: string) => {
  // Tìm user theo email
  const user = await userRepo.findOne({ 
    where: { email },
    relations: ['vaiTro']
  });
  
  if (!user) {
    throw new Error('Email không tồn tại');
  }
  
  // Kiểm tra mật khẩu
  const isPasswordValid = await comparePassword(password, user.matKhau);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu không đúng');
  }
  
  // Tạo payload cho token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.vaiTro.tenVaiTro
  };
  
  // Tạo token
  const tokens = generateTokens(payload);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      ho: user.ho,
      ten: user.ten,
      role: user.vaiTro.tenVaiTro,
      anhDaiDien: user.anhDaiDien
    },
    ...tokens
  };
};

