import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { DONHANG } from './donHang.entity';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';


@Entity('CHITIETDONHANG')
@Index('IDX_maDonHang', ['maDonHang'])
@Index('IDX_maChiTietSanPham', ['maChiTietSanPham'])
export class CHITIETDONHANG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maDonHang: number;

  @Column()
  maChiTietSanPham: number;

  @Column({ default: 1 })
  soLuong: number;

  @Column({ default: 0 })
  donGia: number;

  @ManyToOne(() => DONHANG, (donHang) => donHang.chiTietDonHangs)
  @JoinColumn({ name: 'maDonHang' })
  donHang: DONHANG;

  @ManyToOne(() => SANPHAM_CHITIET, (sanPhamChiTiet) => sanPhamChiTiet.chiTietDonHangs)
  @JoinColumn({ name: 'maChiTietSanPham' })
  sanPhamChiTiet: SANPHAM_CHITIET;
}
