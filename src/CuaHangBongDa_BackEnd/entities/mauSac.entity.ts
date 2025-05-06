import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';

@Entity('MAUSAC')
export class MAUSAC {
  @PrimaryGeneratedColumn({name: 'maMauSac'} )
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  tenMau: string;
  @Column({ type: 'nvarchar', length: 255 })
  moTa: string;

  @OneToMany(() => SANPHAM_CHITIET, (sanPhamChiTiet) => sanPhamChiTiet.mauSac)
  sanPhamChiTiet: SANPHAM_CHITIET[];
}
