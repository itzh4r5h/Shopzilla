const crypto = require("crypto");

exports.isOnlyDigits = (str) => {
  return /^\d+$/.test(str);
};

exports.createHashWithCrypto = (token) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return hash;
};
