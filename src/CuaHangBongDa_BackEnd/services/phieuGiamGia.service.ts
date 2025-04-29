import { AppDataSource } from '../data-source';
import { PHIEUGIAMGIA } from '../entities/phieuGiamGia.entity';
import { PHIEUGIAMGIA_KHACHHANG } from '../entities/phieuGiamGia_khachHang.entity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const phieuGiamGiaRepo = AppDataSource.getRepository(PHIEUGIAMGIA);
const phieuGiamGiaKhachHangRepo = AppDataSource.getRepository(PHIEUGIAMGIA_KHACHHANG);

/**
 * Lấy danh sách tất cả phiếu giảm giá
 */
export const getAllPhieuGiamGia = async () => {
  return await phieuGiamGiaRepo.find({
    relations: ['phieuGiamGiaKhachHangs', 'phieuGiamGiaKhachHangs.nguoiDung']
  });
};

/**
 * Lấy thông tin một phiếu giảm giá theo ID
 */
export const getPhieuGiamGiaById = async (id: number) => {
  return await phieuGiamGiaRepo.findOne({ 
    where: { id },
    relations: ['phieuGiamGiaKhachHangs', 'phieuGiamGiaKhachHangs.nguoiDung']
  });
};

/**
 * Tạo mới phiếu giảm giá
 */
export const createPhieuGiamGia = async (data: Partial<PHIEUGIAMGIA>) => {
  const phieuGiamGia = phieuGiamGiaRepo.create(data);
  return await phieuGiamGiaRepo.save(phieuGiamGia);
};

/**
 * Cập nhật thông tin phiếu giảm giá
 */
export const updatePhieuGiamGia = async (id: number, data: Partial<PHIEUGIAMGIA>) => {
  await phieuGiamGiaRepo.update(id, data);
  return await phieuGiamGiaRepo.findOne({ where: { id } });
};

/**
 * Xóa phiếu giảm giá
 */
export const deletePhieuGiamGia = async (id: number) => {
  // Kiểm tra phiếu giảm giá đã được sử dụng chưa bằng cách sử dụng QueryBuilder
  const usedVouchers = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :id', { id })
    .andWhere('pgkh.daSuDung = :used', { used: true })
    .getMany();

  if (usedVouchers.length > 0) {
    throw new Error('Không thể xóa phiếu giảm giá đã được sử dụng');
  }

  // Xóa liên kết với khách hàng trước bằng QueryBuilder
  await phieuGiamGiaKhachHangRepo
    .createQueryBuilder()
    .delete()
    .where('maPhieuGiamGia = :id', { id })
    .execute();
  
  // Xóa phiếu giảm giá
  return await phieuGiamGiaRepo.delete(id);
};

/**
 * Lấy danh sách phiếu giảm giá còn hiệu lực
 */
export const getPhieuGiamGiaHieuLuc = async () => {
  const currentDate = new Date();
  return await phieuGiamGiaRepo.find({
    where: {
      ngayBatDau: LessThanOrEqual(currentDate),
      ngayKetThuc: MoreThanOrEqual(currentDate)
    }
  });
};

/**
 * Gán phiếu giảm giá cho một khách hàng
 */
export const ganPhieuGiamGiaChoKhachHang = async (maPhieuGiamGia: number, maNguoiDung: number) => {
  // Kiểm tra phiếu giảm giá tồn tại và còn hiệu lực
  const currentDate = new Date();
  const phieuGiamGia = await phieuGiamGiaRepo.findOne({
    where: {
      id: maPhieuGiamGia,
      ngayBatDau: LessThanOrEqual(currentDate),
      ngayKetThuc: MoreThanOrEqual(currentDate)
    }
  });

  if (!phieuGiamGia) {
    throw new Error('Phiếu giảm giá không tồn tại hoặc đã hết hạn');
  }

  // Kiểm tra người dùng đã có phiếu giảm giá này chưa bằng QueryBuilder
  const existingLink = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('pgkh.maNguoiDung = :maNguoiDung', { maNguoiDung })
    .getOne();

  if (existingLink) {
    throw new Error('Khách hàng đã có phiếu giảm giá này');
  }

  // Tạo liên kết mới
  const newLink = phieuGiamGiaKhachHangRepo.create({
    maPhieuGiamGia: maPhieuGiamGia,
    maNguoiDung: maNguoiDung,
    ngayNhan: new Date(),
    daSuDung: false
  } as Partial<PHIEUGIAMGIA_KHACHHANG>); // Cast để TypeScript không phàn nàn

  await phieuGiamGiaKhachHangRepo.save(newLink);
  
  return { success: true, message: 'Gán phiếu giảm giá thành công' };
};

/**
 * Lấy danh sách phiếu giảm giá của một khách hàng
 */
export const getPhieuGiamGiaCuaKhachHang = async (maNguoiDung: number) => {
  // Sử dụng join để lấy thông tin đầy đủ của phiếu giảm giá
  const phieuGiamGias = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .innerJoinAndSelect('pgkh.phieuGiamGia', 'pgg')
    .where('pgkh.maNguoiDung = :maNguoiDung', { maNguoiDung })
    .andWhere('pgkh.daSuDung = :daSuDung', { daSuDung: false })
    .andWhere('pgg.ngayKetThuc >= :now', { now: new Date() })
    .getMany();

  return phieuGiamGias;
};

/**
 * Đánh dấu phiếu giảm giá đã được sử dụng
 */
export const suDungPhieuGiamGia = async (maPhieuGiamGia: number, maNguoiDung: number) => {
  // Kiểm tra phiếu giảm giá tồn tại cho khách hàng và chưa sử dụng
  const phieuGiamGia = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('pgkh.maNguoiDung = :maNguoiDung', { maNguoiDung })
    .andWhere('pgkh.daSuDung = :daSuDung', { daSuDung: false })
    .getOne();

  if (!phieuGiamGia) {
    throw new Error('Không tìm thấy phiếu giảm giá khả dụng cho khách hàng này');
  }

  // Cập nhật trạng thái đã sử dụng
  await phieuGiamGiaKhachHangRepo
    .createQueryBuilder()
    .update()
    .set({ daSuDung: true })
    .where('maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('maNguoiDung = :maNguoiDung', { maNguoiDung })
    .execute();

  return { success: true, message: 'Đã sử dụng phiếu giảm giá' };
};