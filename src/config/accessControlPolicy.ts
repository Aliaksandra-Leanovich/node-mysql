import { Policy } from "./types";

export const accessControlPolicy: Policy = {
  admin: {
    actions: ["GET", "POST", "PUT", "DELETE"],
    resources: ["*"], // access to admin
  },
  candidate: {
    actions: ["GET", "POST", "PUT"],
    resources: ["*"],
  },
};
