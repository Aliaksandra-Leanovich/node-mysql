import { Request } from "express";
import { accessControlPolicy as userType } from "../config";
import { User } from "../entities";

export const verifyUserAuthorization = (
  user: User,
  request: Request
): Boolean => {
  if (!(user.user_type in userType)) return false;

  if (!userType[user.user_type].actions.includes(request.method)) return false;

  const resource = request.baseUrl.replace("/", "");
  const roleResources = userType[user.user_type].resources;
  const isAdmin = roleResources.includes("*");
  const canAccessResource = roleResources.includes(resource);

  if (!isAdmin && !canAccessResource) return false;

  return true;
};
