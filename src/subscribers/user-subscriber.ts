import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { UserType } from "../const";
import { Candidate, User } from "../entities";

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
