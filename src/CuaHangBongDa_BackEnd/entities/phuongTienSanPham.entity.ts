import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SANPHAM } from './sanPham.entity';

@Entity('PHUONGTIENSANPHAM')
export class PHUONGTIENSANPHAM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maSanPham: number;

  @Column({ type: 'varchar', length: 50 })
  tenPhuongTien: string;

  @Column({ type: 'varchar', length: 255 })
  duongDan: string;

  @Column({ type: 'varchar', length: 20, default: 'image' })
  loaiPhuongTien: string; // 'image', 'video', etc.

  @Column({ type: 'bit', default: 0 })
  laPhuongTienChinh: boolean;

  @ManyToOne(() => SANPHAM, (sp) => sp.phuongTienSanPham, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maSanPham' })
  sanPham: SANPHAM;
}