import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { SANPHAM } from './sanPham.entity';

@Entity('PHUONGTIENSANPHAM')
export class PHUONGTIENSANPHAM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  tenPhuongTien: string;

  @ManyToOne(() => SANPHAM, (sp) => sp.phuongTienSanPham)
  sanPham: SANPHAM[];
 
}
