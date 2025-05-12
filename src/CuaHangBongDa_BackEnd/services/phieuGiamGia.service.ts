import { AppDataSource } from '../data-source';
import { PHIEUGIAMGIA } from '../entities/phieuGiamGia.entity';
import { PHIEUGIAMGIA_KHACHHANG } from '../entities/phieuGiamGia_khachHang.entity';
import { NGUOIDUNG } from '../entities/nguoiDung.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Like, In } from 'typeorm';

const phieuGiamGiaRepo = AppDataSource.getRepository(PHIEUGIAMGIA);
const phieuGiamGiaKhachHangRepo = AppDataSource.getRepository(PHIEUGIAMGIA_KHACHHANG);
const nguoiDungRepo = AppDataSource.getRepository(NGUOIDUNG);

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
  // Kiểm tra phiếu giảm giá đã được sử dụng chưa
  const usedVouchers = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :id', { id })
    .andWhere('pgkh.daSuDung = :used', { used: true })
    .getMany();

  if (usedVouchers.length > 0) {
    throw new Error('Không thể xóa phiếu giảm giá đã được sử dụng');
  }

  // Xóa liên kết với khách hàng trước
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
 * Gán phiếu giảm giá cho một hoặc nhiều khách hàng
 * @param maPhieuGiamGia ID của phiếu giảm giá
 * @param data Object chứa maNguoiDung hoặc danhSachNguoiDung
 */
export const ganPhieuGiamGiaChoKhachHang = async (maPhieuGiamGia: number, data: any) => {
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

  // Xác định danh sách người dùng cần gán
  let danhSachNguoiDung: number[] = [];
  
  if (data.maNguoiDung) {
    // Gán cho một người dùng
    danhSachNguoiDung = [data.maNguoiDung];
  } else if (data.danhSachNguoiDung && Array.isArray(data.danhSachNguoiDung)) {
    // Gán cho nhiều người dùng
    danhSachNguoiDung = data.danhSachNguoiDung;
  } else {
    throw new Error('Dữ liệu không hợp lệ');
  }

  // Kiểm tra người dùng tồn tại
  const nguoiDungList = await nguoiDungRepo.find({
    where: {
      id: In(danhSachNguoiDung)
    }
  });

  if (nguoiDungList.length !== danhSachNguoiDung.length) {
    throw new Error('Một hoặc nhiều người dùng không tồn tại');
  }

  // Kiểm tra người dùng đã có phiếu giảm giá này chưa
  const existingLinks = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('pgkh.maNguoiDung IN (:...nguoiDungIds)', { nguoiDungIds: danhSachNguoiDung })
    .getMany();

  // Lọc ra những người dùng chưa có phiếu giảm giá
  const existingUserIds = existingLinks.map(link => link.maNguoiDung);
  const newUserIds = danhSachNguoiDung.filter(id => !existingUserIds.includes(id));

  if (newUserIds.length === 0) {
    throw new Error('Tất cả người dùng đã có phiếu giảm giá này');
  }

  // Tạo các liên kết mới
  const newLinks = newUserIds.map(maNguoiDung => {
    const phieuGiamGiaKhachHang = new PHIEUGIAMGIA_KHACHHANG();
    phieuGiamGiaKhachHang.maPhieuGiamGia = maPhieuGiamGia;
    phieuGiamGiaKhachHang.maNguoiDung = maNguoiDung;
    phieuGiamGiaKhachHang.ngayNhan = data.ngayNhan || new Date();
    phieuGiamGiaKhachHang.daSuDung = false;
    return phieuGiamGiaKhachHang;
  });

  // Lưu các liên kết mới
  return await phieuGiamGiaKhachHangRepo.save(newLinks);
};

/**
 * Lấy danh sách phiếu giảm giá của một khách hàng
 */
export const getPhieuGiamGiaCuaKhachHang = async (maNguoiDung: number) => {
  // Kiểm tra người dùng tồn tại
  const nguoiDung = await nguoiDungRepo.findOne({
    where: { id: maNguoiDung }
  });

  if (!nguoiDung) {
    throw new Error('Người dùng không tồn tại');
  }

  // Sử dụng join để lấy thông tin đầy đủ của phiếu giảm giá
  const phieuGiamGiaLinks = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .innerJoinAndSelect('pgkh.phieuGiamGia', 'pgg')
    .where('pgkh.maNguoiDung = :maNguoiDung', { maNguoiDung })
    .andWhere('pgkh.daSuDung = :daSuDung', { daSuDung: false })
    .andWhere('pgg.ngayKetThuc >= :now', { now: new Date() })
    .getMany();

  // Trả về danh sách phiếu giảm giá thay vì liên kết
  const phieuGiamGias = phieuGiamGiaLinks.map(link => link.phieuGiamGia);

  return phieuGiamGias;
};


/**
 * Xóa phiếu giảm giá của khách hàng
 * @param maPhieuGiamGia ID của phiếu giảm giá
 * @param data Object chứa maNguoiDung hoặc danhSachNguoiDung
 */
export const xoaPhieuGiamGiaKhoiKhachHang = async (maPhieuGiamGia: number, data: any) => {
  // Kiểm tra phiếu giảm giá tồn tại
  const phieuGiamGia = await phieuGiamGiaRepo.findOne({
    where: { id: maPhieuGiamGia }
  });

  if (!phieuGiamGia) {
    throw new Error('Phiếu giảm giá không tồn tại');
  }

  // Xác định danh sách người dùng cần xóa phiếu
  let danhSachNguoiDung: number[] = [];
  
  if (data.maNguoiDung) {
    // Xóa cho một người dùng
    danhSachNguoiDung = [data.maNguoiDung];
  } else if (data.danhSachNguoiDung && Array.isArray(data.danhSachNguoiDung)) {
    // Xóa cho nhiều người dùng
    danhSachNguoiDung = data.danhSachNguoiDung;
  } else {
    throw new Error('Dữ liệu không hợp lệ');
  }

  // Kiểm tra người dùng tồn tại
  const nguoiDungList = await nguoiDungRepo.find({
    where: { id: In(danhSachNguoiDung) }
  });

  if (nguoiDungList.length !== danhSachNguoiDung.length) {
    throw new Error('Một hoặc nhiều người dùng không tồn tại');
  }

  // Kiểm tra phiếu giảm giá đã được sử dụng bởi người dùng chưa
  const usedVouchers = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder('pgkh')
    .where('pgkh.maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('pgkh.maNguoiDung IN (:...nguoiDungIds)', { nguoiDungIds: danhSachNguoiDung })
    .andWhere('pgkh.daSuDung = :used', { used: true })
    .getMany();

  if (usedVouchers.length > 0) {
    const usedUserIds = usedVouchers.map(v => v.maNguoiDung);
    throw new Error(`Không thể xóa phiếu giảm giá đã được sử dụng bởi người dùng: ${usedUserIds.join(', ')}`);
  }

  // Xóa các liên kết phiếu giảm giá - khách hàng
  const result = await phieuGiamGiaKhachHangRepo
    .createQueryBuilder()
    .delete()
    .where('maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('maNguoiDung IN (:...nguoiDungIds)', { nguoiDungIds: danhSachNguoiDung })
    .andWhere('daSuDung = :used', { used: false })
    .execute();

  return {
    soLuongXoa: result.affected || 0,
    nguoiDungs: danhSachNguoiDung
  };
};




/**
 * Tìm kiếm phiếu giảm giá
 */
export const searchPhieuGiamGia = async (params: any) => {
  const { keyword, loaiGiamGia, giaTriToiThieu, giaTriToiDa, trangThai } = params;
  
  // Xây dựng điều kiện tìm kiếm
  const whereConditions: any = {};
  
  if (keyword) {
    whereConditions.tenPhieu = Like(`%${keyword}%`);
  }
  
  if (loaiGiamGia) {
    whereConditions.loaiGiamGia = loaiGiamGia;
  }
  
  // Tìm kiếm theo khoảng giá trị
  if (giaTriToiThieu !== undefined && giaTriToiDa !== undefined) {
    whereConditions.giaTriGiam = Between(giaTriToiThieu, giaTriToiDa);
  } else if (giaTriToiThieu !== undefined) {
    whereConditions.giaTriGiam = MoreThanOrEqual(giaTriToiThieu);
  } else if (giaTriToiDa !== undefined) {
    whereConditions.giaTriGiam = LessThanOrEqual(giaTriToiDa);
  }
  
  // Tìm kiếm theo trạng thái (còn hiệu lực hay hết hạn)
  if (trangThai === 'hieuLuc') {
    const currentDate = new Date();
    whereConditions.ngayBatDau = LessThanOrEqual(currentDate);
    whereConditions.ngayKetThuc = MoreThanOrEqual(currentDate);
  } else if (trangThai === 'hetHan') {
    const currentDate = new Date();
    whereConditions.ngayKetThuc = LessThanOrEqual(currentDate);
  }
  
  return await phieuGiamGiaRepo.find({
    where: whereConditions,
    relations: ['phieuGiamGiaKhachHangs', 'phieuGiamGiaKhachHangs.nguoiDung']
  });
};

/**
 * Đánh dấu phiếu giảm giá đã được sử dụng
 */
export const suDungPhieuGiamGia = async (maPhieuGiamGia: number, maNguoiDung: number) => {
  // Kiểm tra phiếu giảm giá tồn tại cho khách hàng và chưa sử dụng
  const phieuGiamGia = await phieuGiamGiaKhachHangRepo 
    .createQueryBuilder('pgkh')
    .innerJoinAndSelect('pgkh.phieuGiamGia', 'pgg')
    .where('pgkh.maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('pgkh.maNguoiDung = :maNguoiDung', { maNguoiDung })
    .andWhere('pgkh.daSuDung = :daSuDung', { daSuDung: false })
    .andWhere('pgg.ngayKetThuc >= :now', { now: new Date() })
    .getOne();

  if (!phieuGiamGia) {
    throw new Error('Không tìm thấy phiếu giảm giá khả dụng cho khách hàng này');
  }

  // Cập nhật trạng thái đã sử dụng
  await phieuGiamGiaKhachHangRepo
    .createQueryBuilder()
    .update()
    .set({ daSuDung: true, ngaySuDung: new Date() })
    .where('maPhieuGiamGia = :maPhieuGiamGia', { maPhieuGiamGia })
    .andWhere('maNguoiDung = :maNguoiDung', { maNguoiDung })
    .execute();

  return {
    id: phieuGiamGia.id,
    maPhieuGiamGia: phieuGiamGia.id,
    maNguoiDung: phieuGiamGia.maNguoiDung,
    ngaySuDung: new Date(),
    daSuDung: true
  };
};