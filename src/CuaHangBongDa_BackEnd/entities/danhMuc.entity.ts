import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SANPHAM } from './sanPham.entity';

@Entity('DANHMUC')
export class DANHMUC {
  @PrimaryGeneratedColumn({name: 'maDanhMuc'} )
  id: number;

  @Column({ type: 'varchar', length: 255 })
  tenDanhMuc: string;

  @Column({ type: 'text' })
  moTa: string;

  @OneToMany(() => SANPHAM, (sanPham) => sanPham.danhMuc)
  sanPhams: SANPHAM[];
}
