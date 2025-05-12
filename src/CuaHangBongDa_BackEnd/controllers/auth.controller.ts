import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { verifyRefreshToken, generateTokens } from '../utils/jwt.utils';

// Đăng ký tài khoản mới
export const register = async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      // Xử lý trường hợp kết quả là mảng
      
      const user = Array.isArray(result) ? result[0] : result;
    
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          id: user.id,
          email: user.email,
          hoVaTen: user.hoVaTen,
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }
    
    const result = await authService.login(email, password);
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production', // use HTTPS in production
      sameSite: 'strict'
    });
    
    // Send access token in response
    res.json({
      message: 'Đăng nhập thành công',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// Làm mới access token bằng refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token không tồn tại' });
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
    
    // Generate new tokens
    const tokens = generateTokens({
      id: (decoded as any).id,
      email: (decoded as any).email,
      role: (decoded as any).role
    });
    
    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Send new access token
    res.json({ accessToken: tokens.accessToken });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng xuất
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Đăng xuất thành công' });
};


// Xác thực email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Token xác thực không hợp lệ' });
    }
    
    await authService.verifyEmail(token);
    
    res.status(200).json({ message: 'Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Thêm controller gửi lại email xác thực
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }
    
    const result = await authService.resendVerificationEmail(email);
    
    res.status(200).json({ 
      message: 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư đến của bạn.',
      success: result.success
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};