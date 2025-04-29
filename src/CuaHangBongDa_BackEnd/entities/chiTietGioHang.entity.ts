import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GIOHANG } from './gioHang.entity';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';

@Entity('CHiTIET_GIOHANG')
export class GIOHANG_CHITIET {
  @PrimaryColumn()
  maGioHang: number;

  @PrimaryColumn()
  maSanPham: number;

  @Column()
  soLuong: number;

  @ManyToOne(() => GIOHANG, (gioHang) => gioHang.chiTietGioHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maGioHang' })
  gioHang: GIOHANG;
   

  @ManyToOne(() =>SANPHAM_CHITIET, (sanpham) => sanpham.chiTietGioHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maChiTietSanPham' })
  sanPhamChiTiet: SANPHAM_CHITIET;
}
