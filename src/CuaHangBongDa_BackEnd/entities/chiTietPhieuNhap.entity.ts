import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PHIEUNHAP } from './phieuNhap.entity';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';

@Entity('CHITIET_PHIEUNHAP')
export class CHITIET_PHIEUNHAP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maPhieuNhap: number;

  @Column()
  maChiTietSanPham: number;
  
  @Column({type: 'int', default: 1})
  soLuong: number;
  @Column()
  donGia: number;

  @ManyToOne(() => PHIEUNHAP, (phieuNhap) => phieuNhap.chiTietPhieuNhaps)
  @JoinColumn({ name: 'maPhieuNhap' })
  phieuNhap: PHIEUNHAP;

  @ManyToOne(() => SANPHAM_CHITIET, (sanPhamChiTiet) => sanPhamChiTiet.chiTietPhieuNhaps)
  @JoinColumn({ name: 'maChiTietSanPham' })
  sanPhamChiTiet: SANPHAM_CHITIET;
}
