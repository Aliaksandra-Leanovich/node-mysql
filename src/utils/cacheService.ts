const redis = require("ioredis");

export const cache = (req, res, next) => {
  const { id } = req.params;

  redis.get(id, (error, result) => {
    if (error) throw error;

    if (result !== null) {
      return res.json(JSON.parse(result));
    } else {
      return next();
    }
  });
};
