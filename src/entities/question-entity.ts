import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "questions" })
export class Questions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;
}
