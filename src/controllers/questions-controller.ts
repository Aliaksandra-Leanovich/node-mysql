import { Router } from "express";
import { body, param } from "express-validator";
import {
  createQuestionHandler,
  deleteQuestionHandler,
  getAllQuestions,
  getQuestionHandler,
  updateQuestionHandler,
} from "../services/question-service";
import { makeHandlerAsync } from "../utils/asyncFunctionHandler";

const router = Router();

// Create
router.post(
  "/",
  body("question").isLength({ min: 5 }),
  makeHandlerAsync(createQuestionHandler)
);

// Get All
router.get("/", makeHandlerAsync(getAllQuestions));

// Get a single entity
router.get(
  "/:id",
  param("id").isNumeric(),
  makeHandlerAsync(getQuestionHandler)
);

// Get single entity
router.put(
  "/:id",
  param("id").isNumeric(),
  body("question").isLength({ min: 5 }),

  makeHandlerAsync(updateQuestionHandler)
);

// Delete a single entity
router.delete(
  "/:id",
  param("id").isNumeric(),
  makeHandlerAsync(deleteQuestionHandler)
);

export default router;
