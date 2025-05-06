import jwt from 'jsonwebtoken';

// Sử dụng các biến environment hoặc default values khi không có
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-key';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-key';

// Tạo access token và refresh token
export const generateTokens = (payload: any) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Xác thực access token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (error) {
    return null;
  }
};

// Xác thực refresh token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    return null;
  }
};