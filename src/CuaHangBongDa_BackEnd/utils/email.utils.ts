import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình transporter cho nodemailer
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user:  process.env.EMAIL_USER, // Thay bằng email của bạn
      pass: process.env.EMAIL_PASSWORD,  // Thay bằng mật khẩu ứng dụng
    },
  });

// Hàm gửi email xác thực
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực tài khoản Cửa hàng Bóng đá',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">Xác thực tài khoản của bạn</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại Cửa hàng Bóng đá.</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để xác thực tài khoản của bạn:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Xác thực tài khoản</a>
        <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ Cửa hàng Bóng đá</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email xác thực:', error);
    return false;
  }
};