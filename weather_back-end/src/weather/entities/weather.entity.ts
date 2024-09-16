import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column('json')
  data: any;

  @Column()
  fetchedAt: Date;
}
