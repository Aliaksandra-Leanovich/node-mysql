import { Router } from "express";
import { body, param } from "express-validator";
import { deleteUserHandler, getUserHandler, putUserHandler } from "../services";
import { makeHandlerAsync } from "../utils";
import { checkAdminHandler } from "../services/user-service";

const router = Router();

router.put(
  "/:id",
  [
    param("id").isNumeric(),
    body("email").optional().isEmail(),
    body("password").optional().isLength({ min: 8 }),
    body("role").optional().isIn(["admin", "candidate"]),
  ],
  makeHandlerAsync(putUserHandler)
);

// Get a single User
router.get("/:id", param("id").isNumeric(), makeHandlerAsync(getUserHandler));

//Check if user is admin
router.get(
  "/:id/check-admin",
  param("id").isNumeric(),
  makeHandlerAsync(checkAdminHandler)
);

// Delete a single user
router.delete("/:id", param("id").isNumeric(), deleteUserHandler);

export default router;
