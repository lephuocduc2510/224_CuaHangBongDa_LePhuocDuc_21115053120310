import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';
import { PHIEUGIAMGIA } from './phieuGiamGia.entity';

@Entity('PHIEUGIAMGIA_KHACHHANG')
export class PHIEUGIAMGIA_KHACHHANG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maKhachHang: number;

  @Column()
  maVoucher: number;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.phieuGiamGiaKhachHangs)
  @JoinColumn({ name: 'maKhachHang' })
  nguoiDung: NGUOIDUNG;

  @ManyToOne(() => PHIEUGIAMGIA, (phieuGiamGia) => phieuGiamGia.phieuGiamGiaKhachHangs)
  @JoinColumn({ name: 'maVoucher' })
  phieuGiamGia: PHIEUGIAMGIA;
}
