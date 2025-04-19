import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';
import { SANPHAM } from './sanPham.entity';

@Entity('DANHGIA')
export class DANHGIA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maKhachHang: number;

  @Column()
  maSanPham: number;

  @Column ( { type: 'int', default: 0 } )
  xepHang: number;

  @Column({ type: 'text' })
  binhLuan: string;

  @Column({ type: 'datetime' })
  ngayDanhGia: Date;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.danhGias)
  @JoinColumn({ name: 'maKhachHang' })
  nguoiDung: NGUOIDUNG;

  @ManyToOne(() => SANPHAM, (sanPham) => sanPham.danhGias)
  @JoinColumn({ name: 'maSanPham' })
  sanPham: SANPHAM;
}
