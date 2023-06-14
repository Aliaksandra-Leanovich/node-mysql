import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { Answers, User } from "../entities";

const router = Router();
const answerRepository = AppDataSource.getRepository(Answers);
const userRepository = AppDataSource.getRepository(User);

router.post(
  "/",
  body("answer").isLength({ min: 1 }),
  body("questionId").isLength({ min: 1 }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    let answer: Answers = new Answers();
    answer = { ...answer, ...request.body };

    // Attach candidate
    const existingCandidate = await userRepository.findOne({
      where: { id: request.body.id },
    });

    // if (existingCandidate) {
    //     answer.testcandidate_id = existingCandidate.id;
    // }

    answerRepository
      .save(answer)
      .then((new_answer) => {
        response.send(new_answer);
      })
      .catch((err) => {
        response.status(500).send({ error: `${err}` });
      });
  }
);

router.get("/", (request: Request, response: Response) => {
  answerRepository
    .find({
      take: 50,
      //   relations: [""],
    })
    .then((answer) => response.send(answer))
    .catch((err) => {
      response.status(404).send({ error: "Could not find any answers." });
    });
});

router.get(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
    answerRepository
      .findOne({
        where: { id: Number(request.params.id) },
        relations: ["testcandidates", "questions"],
      })
      .then((new_answer) => {
        response.status(200).send(new_answer);
      })
      .catch((error) => response.status(400).send({ error: error }));
  }
);

export default router;
