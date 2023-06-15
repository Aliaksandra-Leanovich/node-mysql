import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../db/data-source";
import { Answers, User } from "../entities";

const answerRepository = AppDataSource.getRepository(Answers);
const userRepository = AppDataSource.getRepository(User);

export const postAnswerHandler = async (
  request: Request,
  response: Response
) => {
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
};

export const getAnswersHandler = (request: Request, response: Response) => {
  answerRepository
    .find({
      take: 50,
      //   relations: [""],
    })
    .then((answer) => response.send(answer))
    .catch((err) => {
      response.status(404).send({ error: "Could not find any answers." });
    });
};

export const getAnswerHandler = (request: Request, response: Response) => {
  answerRepository
    .findOne({
      where: { id: Number(request.params.id) },
      relations: ["testcandidates", "questions"],
    })
    .then((new_answer) => {
      response.status(200).send(new_answer);
    })
    .catch((error) => response.status(400).send({ error: error }));
};
