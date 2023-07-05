import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Messages } from "../const";
import { User } from "../entities";
import { generateJWT, utils } from "../utils";

export const userRepository: Repository<User> =
  AppDataSource.getRepository(User);

export const loginHandler = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const user = await userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "user_type"],
    });

    const isSame = await utils.compareHash(password, user.password);
    const token = generateJWT(user);

    if (!user) {
      return response.status(404).send({ message: Messages.noUserFound });
    }

    if (!isSame) {
      return response.status(403).send({
        message: Messages.wrongPassword,
      });
    }

    response.send({
      email: user.email,
      token,
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

  if (!errors.isEmpty()) {
    return response.status(400).json({ error: errors.array().toString() });
  }

  try {
    const { email, password } = request.body;

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return response
        .status(409)
        .send({ message: "User with sent email already exists." });
    }

    const hash = await utils.hashPassword(password);
    const savedUser = await userRepository.save({
      email,
      password: hash,
    });

    response.send({ id: savedUser.id, message: Messages.signUpSuccess });
  } catch (error) {
    response.status(500).send({ error: `${error}` });
  }
};
