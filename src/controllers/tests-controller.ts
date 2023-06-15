import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { In } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { TestCandidate, Test } from "../entities";
import { makeHandlerAsync } from "../utils/asyncFunctionHandler";
import {
  createTestHandler,
  deleteTestHandler,
  getTestByCandidateHandler,
  getTestDetailsHandler,
  getTestHandler,
  updateTestHandler,
} from "../services/test-service";

const router = Router();

router.post(
  "/",
  body("duration").isLength({ min: 1 }),
  body("level").isLength({ min: 1 }),
  makeHandlerAsync(createTestHandler)
);

router.get("/", makeHandlerAsync(getTestHandler));

// Get a test by testcandidate
router.get(
  "/user/:id",
  param("id").isNumeric(),
  makeHandlerAsync(getTestByCandidateHandler)
);

// Get a test details
router.get(
  "/:id",
  param("id").isNumeric(),
  makeHandlerAsync(getTestDetailsHandler)
);

// Update
router.put(
  "/:id",
  param("id").isNumeric(),
  makeHandlerAsync(updateTestHandler)
);

// Delete a single Test
router.delete(
  "/:id",
  param("id").isNumeric(),
  makeHandlerAsync(deleteTestHandler)
);

export default router;
