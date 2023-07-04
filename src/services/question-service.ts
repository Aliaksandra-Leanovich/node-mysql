import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../db";
import { Questions } from "../entities";

const questionsRepository = AppDataSource.getRepository(Questions);

export const createQuestionHandler = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  let question: Questions = request.body;

  try {
    const newQuestion = await questionsRepository.save(question);
    response.send(newQuestion);
  } catch (error) {
    response.status(500).send({ error: `${error}` });
  }
};

// Get All
export const getAllQuestions = async (request: Request, response: Response) => {
  try {
    const questions = await questionsRepository.find({ take: 55 });
    const questionIds = questions.map((question) => question.id);
    response.status(200).send(questionIds);
  } catch (error) {
    response.status(500).send({ error: `${error}` });
  }
};

// Get a single entity
export const getQuestionHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const question = await questionsRepository.findOne({
      where: { id: Number(request.params.id) },
      relations: ["testquestions", "answers"],
    });
    response.status(200).send(question);
  } catch (error) {
    response.status(400).send({ error });
  }
};
// Get single entity
export const updateQuestionHandler = async (
  request: Request,
  response: Response
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    const question = await questionsRepository.findOne({
      where: { id: Number(request.params.id) },
    });

    if (!question) {
      throw new Error("Question does not exist.");
    }

    const existingQuestion = await questionsRepository.preload(question);
    const updatedQuestion = await questionsRepository.save({
      ...existingQuestion,
      ...request.body,
    });

    response.status(200).send(updatedQuestion);
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
};

// Delete a single entity
export const deleteQuestionHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const question = await questionsRepository.findOne({
      where: { id: Number(request.params.id) },
    });

    if (!question) {
      return response.sendStatus(400);
    }

    await questionsRepository.delete({ id: question.id });
    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(400);
  }
};
