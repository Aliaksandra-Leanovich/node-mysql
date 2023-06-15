import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from "typeorm";
import { User } from "../entities/user-entity";
import { Candidate } from "../entities/candidate-entity";
import { UserType } from "../const";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    const user = event.entity;
    if (user.user_type === UserType.CANDIDATE) {
      const candidateRepository = event.manager.getRepository(Candidate);
      const candidate = new Candidate();
      candidate.user = user.id;

      await candidateRepository.save(candidate);
    }
  }
}
