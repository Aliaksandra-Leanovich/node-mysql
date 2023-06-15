import { NextFunction, Request, Response } from "express";
import * as jsonwebtoken from "jsonwebtoken";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities";
import { verifyUserAuthorization } from "./verifyUserAuthorization";

export const authenticateJWT = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["x-access-token"];

  if (!token) {
    console.log("A token is required for authentication");
    return response.status(403).send("A token is required for authentication");
  }
  try {
    const { verify } = jsonwebtoken;
    const secret: string = String(process.env.AUTH_SECRET);
    console.log({ secret });
    const decoded: any = verify(token, secret);

    let user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded["userId"] },
    });

    console.log(user);

    if (!user) {
      return response.status(403).send({ error: "Resource not allowed." });
    }

    const isAuthorized = verifyUserAuthorization(user, request);
    if (!isAuthorized) {
      return response.status(403).send({ error: "Resource not allowed." });
    }

    request.body["candidate"] = user;
  } catch (err) {
    console.log(err);
    return response.status(401).send({ error: "Invalid Token" });
  }

  return next();
};
