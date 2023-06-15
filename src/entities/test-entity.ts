import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CandidateLevel } from "../const";

@Entity({ name: "tests" })
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column()
  level: CandidateLevel | string;
}
