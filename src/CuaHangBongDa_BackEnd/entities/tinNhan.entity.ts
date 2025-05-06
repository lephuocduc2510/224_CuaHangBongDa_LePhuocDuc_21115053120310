import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NGUOIDUNG } from './nguoiDung.entity';

@Entity('TINNHAN')
export class TINNHAN {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  noiDung: string;

  @Column({ type: 'datetime' })
  ngayGui: Date;

  @Column()
  nguoiGuiId: number;

  @Column()
  nguoiNhanId: number;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.tinNhansGui)
  @JoinColumn({ name: 'nguoiGuiId' })
  nguoiGui: NGUOIDUNG;

  @ManyToOne(() => NGUOIDUNG, (nguoiDung) => nguoiDung.tinNhansNhan)
  @JoinColumn({ name: 'nguoiNhanId' })
  nguoiNhan: NGUOIDUNG;
}
