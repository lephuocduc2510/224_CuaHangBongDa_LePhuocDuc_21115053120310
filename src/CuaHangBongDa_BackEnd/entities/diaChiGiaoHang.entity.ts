import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TINH_THANHPHO } from './tinhThanh.entity';
import { QUAN_HUYEN } from './huyen.entity';
import { PHUONG_XA } from './phuongXa.entity';
import { NGUOIDUNG } from './nguoiDung.entity';

@Entity('DIACHI_GIAOHANG')
export class DIACHI_GIAOHANG {
  @PrimaryGeneratedColumn({ name: 'maDiaChi' })
  id: number;

  @Column()
  maNguoiDung: number;

  @Column()
  maTinhThanhPho: number;

  @Column()
  maQuanHuyen: number;

  @Column()
  maPhuongXa: number;

  @Column({ type: 'nvarchar', length: 255 })
  diaChiCuThe: string;

  @Column({ type: 'nvarchar', length: 50 })
  hoTenNguoiNhan: string;

  @Column({ type: 'varchar', length: 15 })
  soDienThoai: string;

  @Column({ type: 'bit', default: 0 })
  laDiaChiMacDinh: boolean;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  ghiChu: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  ngayTao: Date;

  @Column({ type: 'datetime2', nullable: true })
  ngayCapNhat: Date;

  // Quan hệ với người dùng - Sử dụng string để tránh circular dependency
  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.diaChiGiaoHang)
  @JoinColumn({ name: 'nguoiDungId' })
  nguoiDung: NGUOIDUNG;


  // Quan hệ với tỉnh/thành phố
  @ManyToOne(() => TINH_THANHPHO)
  @JoinColumn({ name: 'maTinhThanhPho' })
  tinhThanhPho: TINH_THANHPHO;

  // Quan hệ với quận/huyện
  @ManyToOne(() => QUAN_HUYEN)
  @JoinColumn({ name: 'maQuanHuyen' })
  quanHuyen: QUAN_HUYEN;

  // Quan hệ với phường/xã
  @ManyToOne(() => PHUONG_XA)
  @JoinColumn({ name: 'maPhuongXa' })
  phuongXa: PHUONG_XA;
}