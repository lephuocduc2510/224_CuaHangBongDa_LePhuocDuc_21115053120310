import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { QUAN_HUYEN } from './huyen.entity';

@Entity('TINH_THANHPHO')
export class TINH_THANHPHO {
  @PrimaryGeneratedColumn({name: 'maTinhThanhPho'} )
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  tenTinhThanh: string;

  @OneToMany(() => QUAN_HUYEN, (quanHuyen) => quanHuyen.tinhThanhPho)
  quanHuyens: QUAN_HUYEN[];
}
