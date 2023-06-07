import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Test } from "./Test";
import { User } from "./User";

@Entity({ name: "testcandidates" })
export class TestCandidate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  candidate_id: User;

  @ManyToOne(() => Test, (test) => test.id)
  test_id: Test;
}
