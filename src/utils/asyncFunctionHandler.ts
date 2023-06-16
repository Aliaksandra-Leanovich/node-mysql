export const makeHandlerAsync = (handler) => {
  return (request, response, next) => {
    handler(request, response, next).catch(next);
  };
};
