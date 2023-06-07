import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Test, User } from "./";

@Entity({ name: "testcandidates" })
export class TestCandidate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  candidate_id: User;

  @ManyToOne(() => Test, (test) => test.id)
  test_id: Test;
}
