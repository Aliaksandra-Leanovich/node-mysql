import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Questions, Test } from ".";

@Entity({ name: "testquestions" })
export class TestQuestions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Test, (test) => test.id)
  test_id: Test;

  @ManyToOne(() => Questions, (question) => question.id)
  question_id: Questions;
}
