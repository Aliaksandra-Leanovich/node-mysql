import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAnswerHandler,
  getAnswersHandler,
  postAnswerHandler,
} from "../services/answer-service";
import { makeHandlerAsync } from "../utils/asyncFunctionHandler";

const router = Router();

router.post(
  "/",
  body("answer").isLength({ min: 1 }),
  body("questionId").isLength({ min: 1 }),
  makeHandlerAsync(postAnswerHandler)
);

router.get("/", makeHandlerAsync(getAnswersHandler));

router.get("/:id", param("id").isNumeric(), makeHandlerAsync(getAnswerHandler));

export default router;
