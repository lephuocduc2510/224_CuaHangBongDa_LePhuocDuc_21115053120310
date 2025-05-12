import { Request, Response } from 'express';
import * as profileService from '../services/profile.services';

/**
 * Lấy thông tin profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await profileService.getProfile(userId);
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cập nhật thông tin profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    const updatedProfile = await profileService.updateProfile(userId, profileData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công',
      data: updatedProfile
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cập nhật avatar
 */
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file ảnh'
      });
    }
    
    const userId = req.user.id;
    const result = await profileService.updateAvatar(userId, req.file);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        avatarUrl: result.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ mật khẩu hiện tại và mật khẩu mới'
      });
    }
    
    await profileService.changePassword(userId, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};