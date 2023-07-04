import { NextFunction, Request, Response } from "express";
import * as jsonwebtoken from "jsonwebtoken";
import { AppDataSource } from "../db";
import { User } from "../entities";
import { verifyUserAuthorization } from "./";

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
    return response.status(403).send("A token is required for authentication");
  }

  try {
    const { verify } = jsonwebtoken;
    const secret: string = String(process.env.AUTH_SECRET);
    const decoded: any = verify(token, secret);
    let user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded["userId"] },
    });

    if (!user) {
      return response.status(403).send({ error: "Resource not allowed." });
    }

    const isAuthorized = verifyUserAuthorization(user, request);
    if (!isAuthorized) {
      return response.status(403).send({ error: "Resource not allowed." });
    }

    request.body["candidate"] = user;
  } catch (err) {
    return response.status(401).send({ error: "Invalid Token" });
  }

  return next();
};
