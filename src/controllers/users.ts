import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import utils from "../services/passwordService";
import { User } from "../entities";
import { AppDataSource } from "../data-source";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.get("/", function (request: Request, response: Response) {
  userRepository
    .find({ take: 10 })
    .then((users) => {
      response.status(200).send(users);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put(
  "/:id",
  param("id").isNumeric(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 8 }),
  body("role").optional().isIn(["admin", "candidate"]),
  async function (request: Request, response: Response) {
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
        throw Error("User does not exist");
      }

      const existingUser = await userRepository.preload(user);
      user = await userRepository.save({ ...existingUser, ...request.body });
      response.status(200).send({
        id: user?.id,
        email: user?.email,
        user_type: user?.user_type,
      });
    } catch (error) {
      response.status(400).send({ error: error });
    }
  }
);

// Get a single User
router.get(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
    userRepository
      .findOne({
        where: { id: Number(request.params.id) },
      })
      .then(async (user) => {
        response.status(200).send(user);
      })
      .catch((error) => response.status(400).send({ error: error }));
  }
);

// Delete a single user
router.delete(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
    userRepository
      .findOne({ where: { id: Number(request.params.id) } })
      .then(async (user) => {
        userRepository.delete({ id: Number(user?.id) });
        response.sendStatus(200);
      })
      .catch((error) => response.sendStatus(400));
  }
);

export default router;
