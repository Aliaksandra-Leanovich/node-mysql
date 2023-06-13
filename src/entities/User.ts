import { IsEmail, Max, Min } from "class-validator";
import { AfterInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserType } from "../utils";
import { Candidate } from "./Candidate";
import { AppDataSource } from "../data-source";

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

  // @AfterInsert()
  // async createCandidate() {
  //   if (this.user_type == UserType.CANDIDATE) {
  //     const candidateRepository = AppDataSource.getRepository(Candidate);

  //     const candidate = new Candidate();
  //     candidate.user = this.id;
  //     // candidate.level = UserType.JUNIOR; // Установите соответствующий уровень кандидата

  //     await candidateRepository.save(candidate);
  //   }
  // }
}
