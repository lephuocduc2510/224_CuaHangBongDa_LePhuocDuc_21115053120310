import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';

@Entity('KICHCO')
export class KICHCO {
  @PrimaryGeneratedColumn({name: 'maKichCo'} )
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  tenKichCo: string
  @Column({ type: 'nvarchar', length: 255 })
  moTa: string;

  @OneToMany(() => SANPHAM_CHITIET, (sanPhamChiTiet) => sanPhamChiTiet.kichCo)
  sanPhamChiTiet: SANPHAM_CHITIET[];
}
