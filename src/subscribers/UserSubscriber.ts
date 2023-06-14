import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "../entities/User";
import { Candidate} from "../entities/Candidate";
import { UserType } from "../utils";

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