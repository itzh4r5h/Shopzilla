// creating the jwt token and saving it in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true //enable it when in production
  };

  // Exclude password manually
  const { password, ...userData } = user._doc;

  const deletionDelay = process.env.USER_DELETION_MINUTES * 60 * 1000; // in ms
  const createdTime = new Date(user.createdAt).getTime(); // timestamp in ms

  const accountDeletionCountdownExpiresAt = new Date(
    createdTime + deletionDelay
  );

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: userData,
      token,
      accountDeletionCountdownExpiresAt: user.isVerified
        ? undefined
        : accountDeletionCountdownExpiresAt,
    });
};

module.exports = sendToken;
