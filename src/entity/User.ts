import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MinLength, Matches } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100,unique: true, type: "varchar", collation: "utf8_general_ci"  })
  uname!: string;

  @Column({ length: 100 })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[A-Za-z])[A-Za-z0-9]+$/, { message: "Password must contain at least 1 letter" })
  password!: string;

}
