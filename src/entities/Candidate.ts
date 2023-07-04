import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export enum CandidateLevel {
  JUNIOR = "junior",
  MIDDLE = "middle",
  SENIOR = "senior",
}

@Entity({ name: "candidates" })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({
    type: "enum",
    enum: CandidateLevel,
  })
  level: CandidateLevel;
}
