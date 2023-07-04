import { IsEmail, Max, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserType } from "../const";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @Min(8)
  @Max(28)
  password: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.CANDIDATE,
    nullable: false,
  })
  user_type: UserType;
}
