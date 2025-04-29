import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';
import { GIOHANG_CHITIET } from './chiTietGioHang.entity';


@Entity('GIOHANG')
export class GIOHANG {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maNguoiDung: number;

  @Column()
  trangThai: ('Chờ xác nhận' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã hủy');

 @Column()
 ngayTao: Date;

 @Column()
 tongTien: number;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.gioHangs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'maNguoiDung' })
  nguoiDung: NGUOIDUNG;


  @OneToMany(() => GIOHANG_CHITIET, (chiTietGioHang) => chiTietGioHang.gioHang)
  chiTietGioHangs: GIOHANG_CHITIET[];
 
}
