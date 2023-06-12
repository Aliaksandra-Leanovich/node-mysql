import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./";
import { CandidateLevel } from "../utils";

@Entity({ name: "candidates" })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: number;

  @Column({
    type: "enum",
    enum: CandidateLevel,
  })
  level: CandidateLevel;
}
