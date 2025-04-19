import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PHIEUGIAMGIA_KHACHHANG } from './phieuGiamGia_khachHang.entity';

@Entity('PHIEUGIAMGIA')
export class PHIEUGIAMGIA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  maVoucher: string;

  @Column({ type: 'varchar', length: 255 })
  tenVoucher: string;

  @Column({ type: 'datetime' })
  ngayBatDau: Date;

  @Column({ type: 'datetime' })
  ngayKetThuc: Date;

  @Column({ type: 'float' })
  giamGia: number;

  @OneToMany(() => PHIEUGIAMGIA_KHACHHANG, (phieuGiamGia) => phieuGiamGia.phieuGiamGia)
    phieuGiamGiaKhachHangs: PHIEUGIAMGIA_KHACHHANG[];
}
