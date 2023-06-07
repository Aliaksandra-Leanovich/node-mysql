import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Questions, TestCandidate } from "./";

@Entity({ name: "answers" })
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TestCandidate, (candidate) => candidate.id)
  testcandidate_id: TestCandidate;

  @OneToOne(() => Questions)
  @JoinColumn()
  question_id: number;

  @Column()
  answer_text: string;
}
