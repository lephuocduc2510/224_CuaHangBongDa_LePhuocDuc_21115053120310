import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PHUONG_XA } from './phuongXa.entity';
import { NGUOIDUNG } from './nguoiDung.entity';
import { CHITIETDONHANG } from './chiTietDonHang.entity';

@Entity('DONHANG')
export class DONHANG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maNguoiDung: number;

  @Column()
  maPhuongXa: number;

  @Column({ type: 'float' })
  tongTien: number;

  @Column({ type: 'date' })
  ngayDatHang: Date;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.donHangs)
  @JoinColumn({ name: 'maNguoiDung' })
  nguoiDung: NGUOIDUNG;


  @OneToMany(() => CHITIETDONHANG, (chiTietDonHang) => chiTietDonHang.donHang)
    chiTietDonHangs: CHITIETDONHANG[];
   
}
