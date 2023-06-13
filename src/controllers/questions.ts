import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { Questions } from "../entities";
import { AppDataSource } from "../data-source";

const router = Router();
const questionsRepository = AppDataSource.getRepository(Questions);

// Create
router.post(
  "/",
  body("question").isLength({ min: 5 }),
  async function (request: Request, response: Response) {
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
  }
);

// Get All
router.get("/", function (request: Request, response: Response) {
  questionsRepository
    .find({ take: 55 })
    .then((questions) => {
      response.status(200).send(questions.map((question) => question.id));
    })
    .catch((error) => {
      console.log(error);
    });
});

// Get a single entity
router.get(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
    questionsRepository
      .findOne({
        where: { id: Number(request.params.id) },
        relations: ["testquestions", "answers"],
      })
      .then(async (question) => {
        response.status(200).send(question);
      })
      .catch((error) => response.status(400).send({ error: error }));
  }
);

// Get single entity
router.put(
  "/:id",
  param("id").isNumeric(),
  body("question").isLength({ min: 5 }),
  function (request: Request, response: Response) {
    // Handle missing fields
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
  }
);

// Delete a single entity
router.delete(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
    questionsRepository
      .findOne({ where: { id: Number(request.params.id) } })
      .then(async (question) => {
        questionsRepository.delete({ id: Number(question?.id) });
        response.sendStatus(200);
      })
      .catch(() => response.sendStatus(400));
  }
);

export default router;
