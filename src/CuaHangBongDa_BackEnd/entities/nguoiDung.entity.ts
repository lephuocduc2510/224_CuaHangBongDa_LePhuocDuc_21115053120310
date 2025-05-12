import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm';
import { VAITRO } from './vaiTro.entity';
import { PHIEUGIAMGIA_KHACHHANG } from './phieuGiamGia_khachHang.entity';
import { DONHANG } from './donHang.entity';
import { GIOHANG } from './gioHang.entity';
import { DANHGIA } from './danhGia.entity';
import { TINNHAN } from './tinNhan.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { DIACHI_GIAOHANG } from './diaChiGiaoHang.entity';

@Entity('NGUOIDUNG')
@Index('IDX_maVaiTro', ['maVaiTro'])
export class NGUOIDUNG {
  @PrimaryGeneratedColumn({ name: 'maNguoiDung' })
  id: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  hoVaTen: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 15 })
  @IsPhoneNumber('VN')
  soDienThoai: string;

  @Column({ type: 'date', nullable: true })
  ngaySinh: Date;

  @Column({ type: 'varchar', length: 255 })
  matKhau: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', nullable: true })
  ngayTao: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  anhDaiDien: string;

  @Column({ type: 'datetime', nullable: true })
  ngayDoiMatKhau: Date;

  @Column({ default: false })
  daXacThuc: boolean;

  @Column({ nullable: true })
  maXacThucEmail: string;

  @Column({ nullable: true })
  thoiGianHetHanMaXacThuc: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tokenDatLaiMatKhau: string;

  @Column({ type: 'datetime', nullable: true })
  tokenHetHan: Date;

  @Column()
  maVaiTro: number;

  @OneToMany(() => DIACHI_GIAOHANG, (diaChi) => diaChi.nguoiDung)
  diaChiGiaoHang: DIACHI_GIAOHANG[];

  @ManyToOne(() => VAITRO, (vaiTro) => vaiTro.nguoiDungs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
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