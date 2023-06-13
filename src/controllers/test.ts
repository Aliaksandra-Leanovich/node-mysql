import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { TestCandidate, Test } from "../entities";

const router = Router();
const testRepository = AppDataSource.getRepository(Test);
const testCandidateRepository = AppDataSource.getRepository(TestCandidate);

router.post(
  "/",
  body("duration").isLength({ min: 1 }),
  body("level").isLength({ min: 1 }),
  async (request: Request, response: Response) => {
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
  }
);

router.get("/", (request: Request, response: Response) => {
  testRepository
    .findOne({
      where: { level: request.params.level },
    })
    .then((test) => response.send(test))
    .catch(() => {
      response.status(404).send({ error: "Could not find any test." });
    });
});

// Get a test by testcandidate
router.get(
  "/user/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
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
  }
);

// Get a test details
router.get(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
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
  }
);

// Update
router.put(
  "/:id",
  param("id").isNumeric(),
  async (request: Request, response: Response) => {
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
  }
);

// Delete a single Test
router.delete(
  "/:id",
  param("id").isNumeric(),
  function (request: Request, response: Response) {
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
  }
);

export default router;
