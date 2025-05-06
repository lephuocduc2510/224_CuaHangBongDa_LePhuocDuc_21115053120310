import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SANPHAM } from './sanPham.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@Entity('NHASANXUAT')
export class NHASANXUAT {
  @PrimaryGeneratedColumn({name: 'maNhaSanXuat'} )
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  tenNhaSanXuat: string;

  @Column({ type: 'nvarchar', length: 255 })
  diaChi: string;

  @Column()
  @IsPhoneNumber('VN')
  soDienThoai: string;

  @Column()
  @IsEmail()
  email: string;

  @OneToMany(() => SANPHAM, (sanPham) => sanPham.nhaSanXuat)
  sanPhams: SANPHAM[];
}
