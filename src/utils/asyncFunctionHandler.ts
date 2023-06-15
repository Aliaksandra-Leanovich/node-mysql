export const makeHandlerAsync = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};
