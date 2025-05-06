import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';

@Entity('VAITRO')
export class VAITRO {
  @PrimaryGeneratedColumn({name: 'maVaiTro'} )
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  tenVaiTro: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  moTa: string;

  @OneToMany(() => NGUOIDUNG, (nguoiDung) => nguoiDung.vaiTro)
  nguoiDungs: NGUOIDUNG[];



    
}

//relation with NguoiDung entity


//relation with NguoiDung entity


