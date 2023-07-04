import { Router } from "express";
import { body } from "express-validator";
import { loginHandler, signupHandler } from "../services";
import { makeHandlerAsync } from "../utils";

const router = Router();

router.post("/login", makeHandlerAsync(loginHandler));

router.post(
  "/signup",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  makeHandlerAsync(signupHandler)
);

export default router;
