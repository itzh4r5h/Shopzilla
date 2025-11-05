const axios = require("axios");

const sendEmail = async (options) => {
  const data = await axios.post(process.env.EMAIL_SERVICE_URL, options);
  return data
};

module.exports = sendEmail;
