const crypto = require("crypto");

exports.isOnlyDigits = (str) => {
  return /^\d+$/.test(str);
};

exports.createHashWithCrypto = (token) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return hash;
};



exports.getBasicDetailsOnly = (user)=>{
  const { password,otp,otpExpire,resetPasswordToken,resetPasswordTokenExpire,emailVerificationToken,emailVerificationTokenExpire, ...userData } = user._doc
  return userData
}


exports.formatJoiErrMessage = (error)=>{
  return error.message.replaceAll('"', "");
}