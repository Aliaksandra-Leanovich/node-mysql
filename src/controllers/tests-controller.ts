import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTestHandler,
  deleteTestHandler,
  getTestByCandidateHandler,
  getTestDetailsHandler,
  getTestHandler,
  updateTestHandler,
} from "../services";
import { makeHandlerAsync } from "../utils";

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
