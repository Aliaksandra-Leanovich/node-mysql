import bcryptjs from "bcryptjs";

const utils = {
  hashPassword: function (plaintextPassword: string) {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs._hash(plaintextPassword, salt);
  },

  compareHash: function (plaintextPassword: string, hash: string) {
    return bcryptjs.compare(plaintextPassword, hash);
  },
};

export default utils;
