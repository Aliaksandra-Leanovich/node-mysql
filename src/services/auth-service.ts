import { Repository } from "typeorm";
import { Messages } from "../const";
import utils from "../utils/passwordService";
import { User } from "../entities";
import { AppDataSource } from "../../ormconfig";
import { generateJWT } from "../utils/generateJWT";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const loginHandler = async (request: Request, response: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { email: request.body.email },
      select: ["id", "email", "password", "user_type"],
    });

    if (!user) {
      return response.status(404).send({ message: Messages.noUserFound });
    }

    const isSame = await utils.compareHash(
      request.body.password,
      user.password
    );

    const token = generateJWT(user);

    if (isSame === false) {
      return response.status(403).send({
        message: Messages.wrongPassword,
      });
    }

    response.send({
      email: user.email,
      token: token,
      id: user.id,
      role: user.user_type,
      message: Messages.logInSuccess,
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

export const signupHandler = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  const userRepository: Repository<User> = AppDataSource.getRepository(User);

  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array().toString() });
  }

  try {
    const user = await userRepository.findOneBy({
      email: `${request.body.email}`,
    });

    if (user) {
      return response
        .status(409)
        .send({ message: "User with sent email already exists." });
    }

    const hash = await utils.hashPassword(request.body.password);
    request.body.password = hash;
    const savedUser = await userRepository.save(request.body);
    response.send({ id: savedUser.id, message: Messages.signUpSuccess });
  } catch (error) {
    response.status(500).send({ error: `${error}` });
  }
};
