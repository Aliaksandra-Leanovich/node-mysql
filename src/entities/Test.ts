import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CandidateLevel } from "../utils";

@Entity({ name: "tests" })
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column()
  level: CandidateLevel | string;
}
