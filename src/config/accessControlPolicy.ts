import { Policy } from "../types/types";

export const accessControlPolicy: Policy = {
  admin: {
    actions: ["GET", "POST", "PUT", "DELETE"],
    resources: ["*"],
  },

  candidate: {
    actions: ["GET", "POST", "PUT"],
    resources: ["tests", "users"],
  },
};
