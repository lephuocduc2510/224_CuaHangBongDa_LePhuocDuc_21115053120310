import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SANPHAM } from './sanPham.entity';
import { MAUSAC } from './mauSac.entity';
import { KICHCO } from './kichCo.entity';

import { DANHGIA } from './danhGia.entity';
import { CHITIETDONHANG } from './chiTietDonHang.entity';
import { GIOHANG_CHITIET } from './chiTietGioHang.entity';
import { CHITIET_PHIEUNHAP } from './chiTietPhieuNhap.entity';

@Entity('SANPHAM_CHITIET')
export class SANPHAM_CHITIET {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maSanPham: number;

  @Column()
  maMauSac: number;

  @Column()
  maKichCo: number;

  @Column()
  maPhuongTien: number;

  @Column({ type: 'float' })
  gia: number;

  @Column({ type: 'int' })
  soLuongTon: number;

  @ManyToOne(() => SANPHAM, (sanPham) => sanPham.sanPhamChiTiet)
  @JoinColumn({ name: 'maSanPham' })
  sanPham: SANPHAM;

  @ManyToOne(() => MAUSAC, (mauSac) => mauSac.sanPhamChiTiet)
  @JoinColumn({ name: 'maMauSac' })
  mauSac: MAUSAC;

  @ManyToOne(() => KICHCO, (kichCo) => kichCo.sanPhamChiTiet)
  @JoinColumn({ name: 'maKichCo' })
  kichCo: KICHCO;

  @OneToMany(() => CHITIETDONHANG, (chiTietDonHang) => chiTietDonHang.sanPhamChiTiet)
  chiTietDonHangs: CHITIETDONHANG[];

  @OneToMany(() => GIOHANG_CHITIET, (chiTietGioHang) => chiTietGioHang.sanPhamChiTiet)
  chiTietGioHangs: GIOHANG_CHITIET[];

  @OneToMany(() => CHITIET_PHIEUNHAP, (chiTietPhieuNhap) => chiTietPhieuNhap.sanPhamChiTiet)
  chiTietPhieuNhaps: CHITIET_PHIEUNHAP[];


 
}
