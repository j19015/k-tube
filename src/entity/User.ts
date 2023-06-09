import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100,unique: true, type: "varchar"})
  uname!: string;

  @Column({ length: 100 })

  password!: string;

}
