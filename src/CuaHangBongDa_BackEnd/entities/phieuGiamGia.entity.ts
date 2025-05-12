import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PHIEUGIAMGIA_KHACHHANG } from './phieuGiamGia_khachHang.entity';


export enum LoaiGiamGia {
  PHANTRAM = 'phanTram',
  TIENMAT = 'tienMat',
}
@Entity('PHIEUGIAMGIA')
export class PHIEUGIAMGIA {
  @PrimaryGeneratedColumn({name: 'STT'})
  id: number;

  @Column({ name: 'maPhieuGiamGia', unique: true, nullable: false, type: 'varchar', length: 50 })
  maPhieuGiamGia: string;

  @Column({ type: 'nvarchar', length: 255 })
   tenVoucher: string;

   @Column({  length: 500, nullable: true })
  moTa: string;

  @Column({ type: 'varchar', enum: LoaiGiamGia, default: LoaiGiamGia.PHANTRAM })
  loaiGiamGia: LoaiGiamGia;

  @Column({type: 'decimal', precision: 10, scale: 2 })
  giaTriGiam: number;

  @Column({  type: 'decimal', precision: 10, scale: 2, nullable: true })
  giaTriToiThieu: number;

  @Column({  type: 'decimal', precision: 10, scale: 2, nullable: true })
  giaTriToiDa: number;

  @Column({  default: 0 })
  luotSuDung: number;

  @Column({  nullable: true })
  luotSuDungToiDa: number;
 

  @Column({ type: 'datetime' })
  ngayBatDau: Date;

  @Column({ type: 'datetime' })
  ngayKetThuc: Date;

  @Column({ name: 'TRANGTHAI', default: true })
  trangThai: boolean;

  @CreateDateColumn()
  ngayTao: Date;

  @UpdateDateColumn()
  ngayCapNhat: Date;

  @OneToMany(() => PHIEUGIAMGIA_KHACHHANG, (phieuGiamGia) => phieuGiamGia.phieuGiamGia)
    phieuGiamGiaKhachHangs: PHIEUGIAMGIA_KHACHHANG[];
}
