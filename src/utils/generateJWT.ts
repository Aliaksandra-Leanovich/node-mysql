import { User } from "../entities";
import * as jsonwebtoken from "jsonwebtoken";

export const generateJWT = (user: User) =>
  jsonwebtoken.sign({ userId: user.id }, String(process.env.AUTH_SECRET), {
    expiresIn: 24 * 60 * 60,
  });
