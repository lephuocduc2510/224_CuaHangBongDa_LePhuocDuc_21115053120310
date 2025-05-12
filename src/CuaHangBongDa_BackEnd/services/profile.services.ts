import { AppDataSource } from '../data-source';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';
import { hashPassword, comparePassword } from './auth.service';
import fs from 'fs';
import path from 'path';

const userRepo = AppDataSource.getRepository(NGUOIDUNG);

/**
 * Lấy thông tin profile của người dùng
 */
export const getProfile = async (userId: number) => {
    const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['vaiTro', 'diaChiGiaoHang']
    });

    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Không trả về các thông tin nhạy cảm
    const { matKhau, tokenDatLaiMatKhau, tokenHetHan, maXacThucEmail, ...userProfile } = user;

    return userProfile;
};

/**
 * Cập nhật thông tin profile
 */
export const updateProfile = async (userId: number, profileData: Partial<NGUOIDUNG>) => {
    // Tìm người dùng
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Danh sách các trường không được phép cập nhật qua API này
    const forbiddenFields = ['id', 'email', 'matKhau', 'maVaiTro', 'tokenDatLaiMatKhau',
        'tokenHetHan', 'maXacThucEmail', 'thoiGianHetHanMaXacThuc', 'daXacThuc', 'anhDaiDien'];

    // Loại bỏ các trường không được phép cập nhật
    for (const field of forbiddenFields) {
        if (field in profileData) {
            delete profileData[field as keyof Partial<NGUOIDUNG>];
        }
    }

    // Nếu có cập nhật ngày sinh và nó là chuỗi, chuyển thành Date
    if (profileData.ngaySinh && typeof profileData.ngaySinh === 'string') {
        profileData.ngaySinh = new Date(profileData.ngaySinh);
    }

    // Cập nhật thông tin
    const updatedUser = { ...user, ...profileData };

    // Lưu vào database
    await userRepo.save(updatedUser);

    // Lấy thông tin đã cập nhật và trả về (không bao gồm thông tin nhạy cảm)
    const updatedUserData = await userRepo.findOne({
        where: { id: userId },
        relations: ['vaiTro']
    });
    
    if (!updatedUserData) {
        throw new Error('Không thể tìm thấy người dùng sau khi cập nhật');
    }

    const { matKhau, tokenDatLaiMatKhau, tokenHetHan, maXacThucEmail, ...result } = updatedUserData;

    return result;
};

/**
 * Cập nhật avatar
 */
export const updateAvatar = async (userId: number, file: Express.Multer.File) => {
    // Tìm người dùng
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Lấy đường dẫn tương đối từ file path
    // Với multer diskStorage, file.path chứa đường dẫn đầy đủ đến file
    const publicDir = path.join(__dirname, '..', 'public');
    const relativePath = file.path.replace(publicDir, '').replace(/\\/g, '/');

    // Xóa avatar cũ nếu có
    if (user.anhDaiDien) {
        const oldAvatarPath = path.join(publicDir, user.anhDaiDien);
        if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
        }
    }

    // Cập nhật đường dẫn avatar trong database
    user.anhDaiDien = relativePath;
    await userRepo.save(user);

    return {
        success: true,
        avatarUrl: user.anhDaiDien
    };
};



/**
 * Đổi mật khẩu
 */
export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    // Tìm người dùng
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await comparePassword(currentPassword, user.matKhau);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Kiểm tra mật khẩu mới
    if (newPassword.length < 6) {
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu và ngày đổi mật khẩu
    user.matKhau = hashedPassword;
    user.ngayDoiMatKhau = new Date();

    await userRepo.save(user);

    return { success: true };
};