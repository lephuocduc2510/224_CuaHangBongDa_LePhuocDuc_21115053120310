require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { CHITIETDONHANG } from './entities/chiTietDonHang.entity';
import { CHITIET_PHIEUNHAP } from './entities/chiTietPhieuNhap.entity';
import { GIOHANG_CHITIET } from './entities/chiTietGioHang.entity';
import { SANPHAM_CHITIET } from './entities/chiTietSanPham.entity';
import { DANHGIA } from './entities/danhGia.entity';
import { DANHMUC } from './entities/danhMuc.entity';
import { DONHANG } from './entities/donHang.entity';
import { PHIEUGIAMGIA } from './entities/phieuGiamGia.entity';
import { PHIEUGIAMGIA_KHACHHANG } from './entities/phieuGiamGia_khachHang.entity';
import { PHIEUNHAP } from './entities/phieuNhap.entity';
import { GIOHANG } from './entities/gioHang.entity';
import { QUAN_HUYEN } from './entities/huyen.entity';
import { KICHCO } from './entities/kichCo.entity';
import { MAUSAC } from './entities/mauSac.entity';
import { NGUOIDUNG } from './entities/nguoiDung.entity';
import { NHACUNGCAP } from './entities/nhaCungCap.entity';
import { NHASANXUAT } from './entities/nhaSanXuat.entity';
import { PHUONGTIENSANPHAM } from './entities/phuongTienSanPham.entity';
import { PHUONG_XA } from './entities/phuongXa.entity';
import { SANPHAM } from './entities/sanPham.entity';
import { TINH_THANHPHO } from './entities/tinhThanh.entity';
import { TINNHAN } from './entities/tinNhan.entity';
import { VAITRO } from './entities/vaiTro.entity';



export const AppDataSource = new DataSource({
  type: 'mssql',
  host: "localhost",
  port: 1433,
  username: 'sa',
  password: '123456',
  database: 'CuaHangBongDa',
  // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  entities: [CHITIETDONHANG, CHITIET_PHIEUNHAP, GIOHANG_CHITIET, SANPHAM_CHITIET, DANHGIA, DANHMUC, DONHANG, PHIEUGIAMGIA, PHIEUGIAMGIA_KHACHHANG, PHIEUNHAP, GIOHANG, QUAN_HUYEN, KICHCO, MAUSAC, NGUOIDUNG, NHACUNGCAP, NHASANXUAT, PHUONGTIENSANPHAM, PHUONG_XA, SANPHAM, TINH_THANHPHO, TINNHAN, VAITRO],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});
