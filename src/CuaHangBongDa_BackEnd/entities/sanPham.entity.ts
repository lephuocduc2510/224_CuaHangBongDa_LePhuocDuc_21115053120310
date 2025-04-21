import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DANHMUC } from './danhMuc.entity';
import { SANPHAM_CHITIET } from './chiTietSanPham.entity';
import { DANHGIA } from './danhGia.entity';
import { NHASANXUAT } from './nhaSanXuat.entity';
import { PHUONGTIENSANPHAM } from './phuongTienSanPham.entity';

@Entity('SANPHAM')
export class SANPHAM {
    @PrimaryGeneratedColumn({name: 'maSanPham'} )
    id: number;

    @Column({ type: 'varchar', length: 255 })
    tenSanPham: string;
    

    // tạo trường gía
    // @Column({ type: 'decimal', precision: 10, scale: 2 })
    // gia: number;


    @Column({ type: 'text' })
    moTa: string;


    @ManyToOne(() => DANHMUC, (danhMuc) => danhMuc.sanPhams)
    @JoinColumn({ name: 'maDanhMuc' })
    danhMuc: DANHMUC;
    @OneToMany(() => PHUONGTIENSANPHAM, (phuongTienSanPham) => phuongTienSanPham.sanPham)
    phuongTienSanPham: PHUONGTIENSANPHAM[];

    @OneToMany(() => SANPHAM_CHITIET, (sanPhamChiTiet) => sanPhamChiTiet.sanPham)
    sanPhamChiTiet: SANPHAM_CHITIET[];

    // relation to danhgia
    @OneToMany(() => DANHGIA, (danhGia) => danhGia.sanPham)
    danhGias: DANHGIA[];

    @ManyToOne(() => NHASANXUAT, (nhaSanXuat) => nhaSanXuat.sanPhams)
    @JoinColumn({ name: 'maNhaSanXuat' })
    nhaSanXuat: NHASANXUAT;

    
}
