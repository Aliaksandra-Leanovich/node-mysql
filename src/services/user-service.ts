import { validationResult } from "express-validator";
import { utils } from "../utils";
import { AppDataSource } from "../../ormconfig";
import { User } from "../entities/user-entity";
import { Request, Response } from "express";
import { Repository } from "typeorm";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const putUserHandler = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await userRepository.findOne({
      where: { id: Number(request.params.id) },
    });

    if (request.body?.performer?.user_type !== "admin") {
      request.body.role = user?.user_type;
    }

    if (request.body.password !== undefined) {
      let hash = await utils.hashPassword(request.body.password);
      request.body.password = hash;
    }

    if (!user) {
      throw new Error("User does not exist");
    }

    const existingUser = await userRepository.preload(user);
    user = await userRepository.save({ ...existingUser, ...request.body });
    response.status(200).send({
      id: user?.id,
      email: user?.email,
      user_type: user?.user_type,
    });
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
};

export const getUserHandler = async (request: Request, response: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { id: Number(request.params.id) },
    });

    response.status(200).send(user);
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
};

export const deleteUserHandler = (request: Request, response: Response) => {
  userRepository
    .findOne({ where: { id: Number(request.params.id) } })
    .then(async (user) => {
      userRepository.delete({ id: Number(user?.id) });
      response.sendStatus(200);
    })
    .catch((error) => response.sendStatus(400));
};
