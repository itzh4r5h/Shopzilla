const crypto = require("crypto");

exports.isOnlyDigits = (str) => {
  return /^\d+$/.test(str);
};

exports.createHashWithCrypto = (token) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return hash;
};



exports.getBasicDetailsOnly = (user)=>{
  const { password,otp,otpExpire,resendTokenIn,resetPasswordToken,resetPasswordTokenExpire,emailVerificationToken,emailVerificationTokenExpire, ...userData } = user._doc
  return userData
}


exports.formatJoiErrMessage = (error)=>{
  const msg = error.message.split('.').splice(-1)[0]
  return msg.replaceAll('"', "");
}

/**
 * Generate a 14-char SKU.
 * - Uses last 4 chars of productId
 * - Uses up to 3 string-type attribute values (3 chars each)
 * - Fills gaps with "X"
 * - Adds a 4-char random suffix to guarantee uniqueness
 */
exports.generateSKU = (product,attributes) => {
  // 1️⃣  Product code (last 4 chars of ObjectId)
  const productCode = product
    .toString()
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-4)
    .toUpperCase();

  // 2️⃣  Pick only string-valued attributes
  const strAttrs = (attributes || [])
    .filter(attr => typeof attr.value === "string")
    .slice(0, 3); // take first 3 strings only

  // 3️⃣  Build a 9-char block from them
  const attrBlock = strAttrs
    .map(a =>
      a.value
        .replace(/[^a-zA-Z0-9]/g, "") // keep alnum only
        .slice(0, 3)                  // max 3 chars each
        .toUpperCase()
    )
    .join("")
    .padEnd(9, "X"); // pad if <9

  // 4️⃣  1-char random (so far we have 4+9 = 13, need 1 more)
  const randomChar = crypto.randomBytes(1).toString("hex")[0].toUpperCase();

  // 5️⃣  Final SKU
  return `${productCode}${attrBlock}${randomChar}`; // 14 chars
}

