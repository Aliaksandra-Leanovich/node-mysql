import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../db";
import { Questions } from "../entities";

const questionsRepository = AppDataSource.getRepository(Questions);

export const createQuestionHandler = (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  let question: Questions = new Questions();
  question = { ...question, ...request.body };

  // Persist to DB
  questionsRepository
    .save(question)
    .then((question) => {
      response.send(question);
    })
    .catch((err) => {
      response.status(500).send({ error: `${err}` });
    });
};

// Get All
export const getAllQuestions = (request: Request, response: Response) => {
  questionsRepository
    .find({ take: 55 })
    .then((questions) => {
      response.status(200).send(questions.map((question) => question.id));
    })
    .catch((error) => {
      response.status(500).send({ error: `${error}` });
    });
};

// Get a single entity
export const getQuestionHandler = (request: Request, response: Response) => {
  questionsRepository
    .findOne({
      where: { id: Number(request.params.id) },
      relations: ["testquestions", "answers"],
    })
    .then(async (question) => {
      response.status(200).send(question);
    })
    .catch((error) => response.status(400).send({ error: error }));
};

// Get single entity
export const updateQuestionHandler = (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  questionsRepository
    .findOne({
      where: { id: Number(request.params.id) },
    })
    .then(async (question) => {
      if (!question) throw Error("Question does not exist.");
      // Update record
      const existingQuestion = await questionsRepository.preload(question);
      question = await questionsRepository.save({
        ...existingQuestion,
        ...request.body,
      });
      response.status(200).send(question);
    })
    .catch((error) => response.status(400).send({ error: error }));
};

// Delete a single entity
export const deleteQuestionHandler = (request: Request, response: Response) => {
  questionsRepository
    .findOne({ where: { id: Number(request.params.id) } })
    .then(async (question) => {
      questionsRepository.delete({ id: Number(question?.id) });
      response.sendStatus(200);
    })
    .catch(() => response.sendStatus(400));
};
