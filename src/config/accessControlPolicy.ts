import { Policy } from "./types";

export const accessControlPolicy: Policy = {
  admin: {
    actions: ["GET", "POST", "PUT", "DELETE"],
    resources: ["tests"], //create in controllers!
  },

  candidate: {
    actions: ["GET", "POST", "PUT"],
    resources: ["*"],
  },
};
