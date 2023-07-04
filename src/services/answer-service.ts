import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../db";
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

  const existingCandidate = await userRepository.findOne({
    where: { id: request.body.id },
  });

  if (existingCandidate) {
    //@ts-ignore
    answer.testcandidate_id = existingCandidate.id;
  }

  answerRepository
    .save(answer)
    .then((new_answer) => {
      response.send(new_answer);
    })
    .catch((err) => {
      response.status(500).send({ error: `${err}` });
    });
};

export const getAnswersHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const answers = await answerRepository.find({ take: 50 });
    response.send(answers);
  } catch (error) {
    response.sendStatus(404).send({ error: "Could not find any answers." });
  }
};

export const getAnswerHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const answer = await answerRepository.findOne({
      where: { id: Number(request.params.id) },
      relations: ["testcandidates", "questions"],
    });

    if (!answer) {
      return response.sendStatus(404).send({ error: "Answer not found." });
    }

    response.status(200).send(answer);
  } catch (error) {
    response.sendStatus(400).send({ error: error.message });
  }
};
