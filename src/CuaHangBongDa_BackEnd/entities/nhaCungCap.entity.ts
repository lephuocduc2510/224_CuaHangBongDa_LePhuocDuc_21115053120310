import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { SANPHAM } from './sanPham.entity';
import { PHIEUNHAP } from './phieuNhap.entity';



@Entity()
export class NHACUNGCAP {
  @PrimaryGeneratedColumn({ name: 'maNhaCungCap', type: 'int' }) 
  id: number;

  @Column({ length: 100 })
  tenNhaCungCap: string;

  @Column({ length: 255 })
  diaChi: string;

  @Column({ length: 15 })
  soDienThoai: string;

  @Column({ length: 100 })
  email: string;

  @OneToMany(() => PHIEUNHAP, (phieuNhap) => phieuNhap.nhaCungCap)
  phieuNhaps: PHIEUNHAP[];


}