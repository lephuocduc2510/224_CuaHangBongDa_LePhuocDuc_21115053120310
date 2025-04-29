import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { NHACUNGCAP } from './nhaCungCap.entity';
import { CHITIET_PHIEUNHAP } from './chiTietPhieuNhap.entity';

@Entity('PHIEUNHAP')
export class PHIEUNHAP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maNhaCungCap: number;

  @ManyToOne(() => NHACUNGCAP, (nhaCungCap) => nhaCungCap.phieuNhaps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maNhaCungCap' })
  nhaCungCap: NHACUNGCAP;

  @OneToMany(() => CHITIET_PHIEUNHAP, (chiTietPhieuNhap) => chiTietPhieuNhap.phieuNhap)
  chiTietPhieuNhaps: CHITIET_PHIEUNHAP[];
}
