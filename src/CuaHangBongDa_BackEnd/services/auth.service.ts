import { AppDataSource } from '../data-source';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.utils';
import { sendVerificationEmail } from '../utils/email.utils';
import crypto from 'crypto';
import { MoreThan } from 'typeorm';

const userRepo = AppDataSource.getRepository(NGUOIDUNG);

// Mã hóa mật khẩu
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// So sánh mật khẩu
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Cập nhật lại hàm đăng ký
export const register = async (userData: any) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await userRepo.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Hash password trước khi lưu
  const hashedPassword = await hashPassword(userData.password || userData.matKhau);
  
  // Tạo mã xác thực ngẫu nhiên
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Tạo thời gian hết hạn cho mã xác thực (24 giờ)
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);
  
  // Tạo user mới
  const newUser = userRepo.create({
    ...userData,
    matKhau: hashedPassword,
    maVaiTro: userData.maVaiTro || 3, // Mặc định là vai trò khách hàng
    ngayDoiMatKhau: new Date(),
    tokenDatLaiMatKhau: '',
    tokenHetHan: new Date(),
    daXacThuc: false,
    maXacThucEmail: verificationToken,
    thoiGianHetHanMaXacThuc: expirationTime
  });
  
  // Lưu user mới
  const savedUser = await userRepo.save(newUser);
  
  // Gửi email xác thực
  try {
    // Gửi email xác thực
    await sendVerificationEmail(userData.email, verificationToken);
  } catch (emailError) {
    console.error('Lỗi gửi email nhưng vẫn đăng ký thành công:', emailError);
    // Vẫn tiếp tục trả về user đã đăng ký mà không ném lỗi
  }
  
  return savedUser;
};

// Thêm hàm xác thực email
export const verifyEmail = async (token: string) => {
  const user = await userRepo.findOne({ 
    where: { 
      maXacThucEmail: token,
      thoiGianHetHanMaXacThuc: MoreThan(new Date()) // Kiểm tra token chưa hết hạn
    } 
  });
  
  if (!user) {
    throw new Error('Mã xác thực không hợp lệ hoặc đã hết hạn');
  }
  
  // Cập nhật trạng thái xác thực
  user.daXacThuc = true;
  user.maXacThucEmail = "null";
  user.thoiGianHetHanMaXacThuc = new Date();
  
  return await userRepo.save(user);
};

// Cập nhật hàm đăng nhập để kiểm tra xác thực email
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
  
  // Kiểm tra tài khoản đã xác thực email chưa
  if (!user.daXacThuc) {
    throw new Error('Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.');
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
      hoVaTen: user.hoVaTen, 
      role: user.vaiTro.tenVaiTro,
      anhDaiDien: user.anhDaiDien
    },
    ...tokens
  };
};

// Thêm hàm gửi lại email xác thực
export const resendVerificationEmail = async (email: string) => {
  const user = await userRepo.findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Email không tồn tại');
  }
  
  if (user.daXacThuc) {
    throw new Error('Tài khoản này đã được xác thực');
  }
  
  // Tạo mã xác thực mới
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Cập nhật thời gian hết hạn
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);
  
  // Cập nhật thông tin xác thực
  user.maXacThucEmail = verificationToken;
  user.thoiGianHetHanMaXacThuc = expirationTime;
  
  await userRepo.save(user);
  
  // Gửi lại email xác thực
  const result = await sendVerificationEmail(user.email, verificationToken);
  
  return { success: result };
};
