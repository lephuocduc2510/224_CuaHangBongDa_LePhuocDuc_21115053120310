import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';
import { PHIEUGIAMGIA } from './phieuGiamGia.entity';

@Entity('PHIEUGIAMGIA_KHACHHANG')
export class PHIEUGIAMGIA_KHACHHANG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'maNguoiDung', nullable: false}) 
  maNguoiDung: number;

  @Column({ name: 'maPhieuGiamGia', nullable: false })
  maPhieuGiamGia: number;

  @Column({type: 'datetime2', default: () => 'GETDATE()'})
  ngayNhan: Date;
 @Column({ name: 'NGAYSUDUNG', type: 'datetime', nullable: true })
  ngaySuDung: Date;
  @Column({default: false})
  daSuDung: boolean;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.phieuGiamGiaKhachHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maNguoiDung' })
  nguoiDung: NGUOIDUNG;

  @ManyToOne(() => PHIEUGIAMGIA, (phieuGiamGia) => phieuGiamGia.phieuGiamGiaKhachHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maPhieuGiamGia' })
  phieuGiamGia: PHIEUGIAMGIA;
}
