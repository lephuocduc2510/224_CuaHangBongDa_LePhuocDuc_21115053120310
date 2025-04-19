import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm';
import { VAITRO } from './vaiTro.entity';
import { PHIEUGIAMGIA_KHACHHANG } from './phieuGiamGia_khachHang.entity';
import { DONHANG } from './donHang.entity';
import { GIOHANG } from './gioHang.entity';
import { DANHGIA } from './danhGia.entity';
import { TINNHAN } from './tinNhan.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@Entity('NGUOIDUNG')
@Index('IDX_maVaiTro', ['maVaiTro'])
export class NGUOIDUNG {
  @PrimaryGeneratedColumn({name: 'maNguoiDung'} )
  id: number;

  @Column({ type: 'varchar', length: 50  })
  ho: string;

  @Column({ type: 'varchar', length: 50 })
  ten: string;

  @Column()
  maPhuongXa: number;

  @Column({ type: 'varchar', length: 500 })
  diaChi: string;

  @Column({ type: 'varchar', length: 50, unique: true , nullable: false})
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 15 })
  @IsPhoneNumber('VN')
  soDienThoai: string;

  @Column({ type: 'date' })
  ngaySinh: Date;

  @Column({ type: 'varchar', length: 255 })
  matKhau: string;

  @Column({ type: 'varchar', length: 500 })
  anhDaiDien: string;

  @Column({ type: 'datetime' })
  ngayDoiMatKhau: Date;

  @Column({ type: 'varchar', length: 255 })
  tokenDatLaiMatKhau: string;

  @Column({ type: 'datetime' })
  tokenHetHan: Date;

  @Column()
  maVaiTro: number;

  @ManyToOne(() => VAITRO, (vaiTro) => vaiTro.nguoiDungs)
  @JoinColumn({ name: 'maVaiTro' })
  vaiTro: VAITRO;

  @OneToMany(() => PHIEUGIAMGIA_KHACHHANG, (phieuGiamGiaKhachHang) => phieuGiamGiaKhachHang.nguoiDung)
  phieuGiamGiaKhachHangs: PHIEUGIAMGIA_KHACHHANG[];

  @OneToMany(() => DONHANG, (donHang) => donHang.nguoiDung)
  donHangs: DONHANG[];

  @OneToMany(() => GIOHANG, (gioHang) => gioHang.nguoiDung)
  gioHangs: GIOHANG[];

  @OneToMany(() => DANHGIA, (danhGia) => danhGia.nguoiDung)
  danhGias: DANHGIA[];

  @OneToMany(() => TINNHAN, (tinNhan) => tinNhan.nguoiGui)
  tinNhansGui: TINNHAN[];

  @OneToMany(() => TINNHAN, (tinNhan) => tinNhan.nguoiNhan)
  tinNhansNhan: TINNHAN[];
}
