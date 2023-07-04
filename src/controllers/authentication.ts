import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import { generateJWT } from "../services/authService";
import utils from "../services/passwordService";
import { Messages } from "../utils";

const router = Router();
const userRepository: Repository<User> = AppDataSource.getRepository(User);

router.post("/login", async function (request, response) {
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
});

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async function (request: Request, response: Response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ error: errors.array().toString() });
    }

    const user = await userRepository.findOneBy({
      email: `${request.body.email}`,
    });

    if (user) {
      return response
        .status(409)
        .send({ message: "User with sent email already exists." });
    }

    utils
      .hashPassword(request.body.password)
      .then(async (hash) => {
        request.body.password = hash;
        let user: User = await userRepository.save(request.body);
        response.send({ id: user.id, message: Messages.signUpSuccess });
      })
      .catch((err) => {
        response.status(500).send({ error: `${err}` });
      });
  }
);

export default router;
