import { NextFunction, Request, Response, Router } from "express";
import jsonwebtoken, { sign } from "jsonwebtoken";
import { accessControlPolicy as userType } from "../config/accessControlPolicy";
import { User } from "../entities";
import { AppDataSource } from "../data-source";

// Protecting path
const authenticateJWT = async (
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
    const decoded: any = verify(token, secret);

    // Apply Attribute-Based Access Control
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

    // Attach request's identity to Request object
    request.body["candidate"] = user;
  } catch (err) {
    return response.status(401).send({ error: "Invalid Token" });
  }

  return next();
};

export const generateJWT = (user: User) =>
  sign({ userId: user.id }, String(process.env.AUTH_SECRET), {
    expiresIn: 24 * 60 * 60, // expires in 24 hours
  });

export const verifyUserAuthorization = (
  user: User,
  request: Request
): Boolean => {
  // Check whether user has appropriate role
  if (!(user.user_type in userType)) return false;

  // Check HTTP attribute
  if (!userType[user.user_type].actions.includes(request.method)) return false;

  // Check resource
  const resource = request.baseUrl.replace("/", "");
  const roleResources = userType[user.user_type].resources;
  const isAdmin = roleResources.includes("*");

  const canAccessResource = roleResources.includes(resource);
  if (!isAdmin && !canAccessResource) return false;

  return true;
};

export default authenticateJWT;
