import { AppDataSource } from '../data-source';
import { TINH_THANHPHO } from '../entities/tinhThanh.entity';
import { QUAN_HUYEN } from '../entities/huyen.entity';
import { PHUONG_XA } from '../entities/phuongXa.entity';

const tinhRepo = AppDataSource.getRepository(TINH_THANHPHO);
const huyenRepo = AppDataSource.getRepository(QUAN_HUYEN);
const xaRepo = AppDataSource.getRepository(PHUONG_XA);

// Lấy tất cả tỉnh/thành phố
export const getAllTinhThanh = async () => {
  return await tinhRepo.find({
    order: {
      tenTinhThanh: 'ASC' // Sắp xếp theo tên
    }
  });
};

// Lấy chi tiết tỉnh/thành phố theo ID
export const getTinhThanhById = async (id: number) => {
  return await tinhRepo.findOne({
    where: { id }
  });
};

// Lấy tất cả quận/huyện
export const getAllQuanHuyen = async () => {
  return await huyenRepo.find({
    relations: ['tinhThanhPho'],
    order: {
      tenQuanHuyen: 'ASC'
    }
  });
};

// Lấy quận/huyện theo tỉnh/thành phố
export const getQuanHuyenByTinhThanh = async (maTinhThanhPho: number) => {
  return await huyenRepo.find({
    where: { maTinhThanhPho },
    order: {
      tenQuanHuyen: 'ASC'
    }
  });
};

// Lấy chi tiết quận/huyện theo ID
export const getQuanHuyenById = async (id: number) => {
  return await huyenRepo.findOne({
    where: { id },
    relations: ['tinhThanhPho']
  });
};

// Lấy tất cả phường/xã
export const getAllPhuongXa = async () => {
  return await xaRepo.find({
    relations: ['quanHuyen'],
    order: {
      tenPhuongXa: 'ASC'
    }
  });
};

// Lấy phường/xã theo quận/huyện
export const getPhuongXaByQuanHuyen = async (maQuanHuyen: number) => {
  return await xaRepo.find({
    where: { maQuanHuyen },
    order: {
      tenPhuongXa: 'ASC'
    }
  });
};

// Lấy chi tiết phường/xã theo ID
export const getPhuongXaById = async (id: number) => {
  return await xaRepo.findOne({
    where: { id },
    relations: ['quanHuyen']
  });
};

// Lấy cấu trúc địa chính đầy đủ
export const getDiaChinh = async () => {
  const tinhThanhs = await tinhRepo.find({
    relations: ['quanHuyens'],
    order: {
      tenTinhThanh: 'ASC'
    }
  });

  // Cấu trúc dữ liệu phân cấp đầy đủ
  return tinhThanhs;
};

// Lấy địa chỉ đầy đủ theo mã
export const getDiaChiDayDu = async (maTinh: number, maHuyen: number, maXa: number) => {
  const tinhThanh = await tinhRepo.findOne({ where: { id: maTinh } });
  const quanHuyen = await huyenRepo.findOne({ where: { id: maHuyen } });
  const phuongXa = await xaRepo.findOne({ where: { id: maXa } });

  if (!tinhThanh || !quanHuyen || !phuongXa) {
    throw new Error('Không tìm thấy thông tin địa chỉ');
  }

  return {
    tinhThanh,
    quanHuyen,
    phuongXa,
    diaChiDayDu: `${phuongXa.tenPhuongXa}, ${quanHuyen.tenQuanHuyen}, ${tinhThanh.tenTinhThanh}`
  };
};