const bcrypt = require("bcrypt");

const salt = 11;

const encrypt = (pw) => {
  return bcrypt.hashSync(pw, salt);
};

const compare = async(pw, hash) => {
  return await bcrypt.compare(pw, hash);
};

module.exports = {encrypt, compare}
