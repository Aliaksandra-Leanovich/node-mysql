import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../db/data-source";
import { Test, TestCandidate } from "../entities";

const router = Router();
const testRepository = AppDataSource.getRepository(Test);
const testCandidateRepository = AppDataSource.getRepository(TestCandidate);

export const createTestHandler = (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  let test: Test = new Test();
  test = { ...test, ...request.body };

  testRepository
    .save(test)
    .then((new_test) => {
      response.send(new_test);
    })
    .catch((err) => {
      response.status(500).send({ error: `${err}` });
    });
};

export const getTestHandler = (request: Request, response: Response) => {
  testRepository
    .findOne({
      where: { level: request.params.level },
    })
    .then((test) => response.send(test))
    .catch(() => {
      response.status(404).send({ error: "Could not find any test." });
    });
};

// Get a test by testcandidate
export const getTestByCandidateHandler = (
  request: Request,
  response: Response
) => {
  testCandidateRepository
    .findOne({
      where: { id: Number(request.params.id) },
      relations: ["tests"],
      select: ["id", "test_id", "candidate_id"],
    })
    .then((project) => {
      response.status(200).send(project);
    })
    .catch((error) => response.status(400).send({ error: error }));
};

// Get a test details
export const getTestDetailsHandler = (request: Request, response: Response) => {
  testRepository
    .findOne({
      where: { id: Number(request.params.id) },
      relations: ["testquestion", "testcandidate"],
      select: ["id", "duration", "level"],
    })
    .then((test) => {
      response.status(200).send(test);
    })
    .catch((error) => response.status(400).send({ error: error }));
};

// Update
export const updateTestHandler = (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  testRepository
    .findOne({
      where: { level: request.params.level },
    })
    .then(async (test) => {
      if (!test) {
        throw Error("Test does not exist.");
      }

      // Update basic fields
      const existingTest = await testRepository.preload(test);

      // Persist and return entity
      const new_test = await testRepository.save({
        ...existingTest,
        ...request.body,
      });
      response.send(new_test);
    })
    .catch((err) => {
      response.status(500).send({ error: `${err}` });
    });
};

// Delete a single Test

export const deleteTestHandler = (request: Request, response: Response) => {
  testRepository
    .findOne({
      where: { level: request.params.level },
    })
    .then(async (test) => {
      await testRepository.delete({ id: Number(test?.id) });
      response.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      response.sendStatus(400);
    });
};
