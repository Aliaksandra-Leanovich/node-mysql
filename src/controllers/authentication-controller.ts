import { Router } from "express";
import { body } from "express-validator";
import { makeHandlerAsync } from "../utils/asyncFunctionHandler";
import { loginHandler, signupHandler } from "../services/auth-service";

const router = Router();

router.post("/login", makeHandlerAsync(loginHandler));

router.post(
  "/signup",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  makeHandlerAsync(signupHandler)
);

export default router;
