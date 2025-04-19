import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QUAN_HUYEN } from './huyen.entity';

@Entity('PHUONG_XA')
export class PHUONG_XA {
  @PrimaryGeneratedColumn({name: 'maPhuongXa'} )
  id: number;

  @Column({ type: 'varchar', length: 255 })
  tenPhuongXa: string;

  @Column()
  maQuanHuyen: number;

  @ManyToOne(() => QUAN_HUYEN, (quanHuyen) => quanHuyen.phuongXas)
  @JoinColumn({ name: 'maQuanHuyen' })
  quanHuyen: QUAN_HUYEN;
}
