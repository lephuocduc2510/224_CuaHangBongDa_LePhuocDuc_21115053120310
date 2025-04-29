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

  @Column()
  ngayNhan: Date;

  @Column()
  daSuDung: boolean;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.phieuGiamGiaKhachHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maKhachHang' })
  nguoiDung: NGUOIDUNG;

  @ManyToOne(() => PHIEUGIAMGIA, (phieuGiamGia) => phieuGiamGia.phieuGiamGiaKhachHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maVoucher' })
  phieuGiamGia: PHIEUGIAMGIA;
}
