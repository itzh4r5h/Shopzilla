const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const { email, subject, message } = options;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:  process.env.SMTP_PORT, 
    secure: true,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });


  // Optional: check connection
  transporter.verify((err, success) => {
    if (err) console.error("SMTP verify failed:", err);
    else console.log("SMTP connection OK");
  });


  const mailOptions = {
    from: `shopzilla <${process.env.GMAIL_ID}>`,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
