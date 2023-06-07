export type Policy = {
  [key: string]: {
    actions: string[];
    resources: string[];
  };
};
