const bcrypt = require("bcrypt");

export const utils = {
  hashPassword: function (plaintextPassword: string) {
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hash(plaintextPassword, salt);
  },

  compareHash: function (plaintextPassword: string, hash: string) {
    return bcrypt.compare(plaintextPassword, hash);
  },
};
