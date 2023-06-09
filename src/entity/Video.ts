import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  URL!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
