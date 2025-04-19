import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TINH_THANHPHO } from './tinhThanh.entity';
import { PHUONG_XA } from './phuongXa.entity';

@Entity('QUAN_HUYEN')
export class QUAN_HUYEN {
  @PrimaryGeneratedColumn({name: 'maQuanHuyen'} )
  id: number;

  @Column({ type: 'varchar', length: 255 })
  tenQuanHuyen: string;

  @Column()
  maTinhThanhPho: number;

  @OneToMany(() => PHUONG_XA, (phuongXa) => phuongXa.quanHuyen)
  phuongXas: PHUONG_XA[];

  @ManyToOne(() => TINH_THANHPHO, (tinhThanhPho) => tinhThanhPho.quanHuyens)
  @JoinColumn({ name: 'maTinhThanhPho' })
  tinhThanhPho: TINH_THANHPHO;
}
