const express = require('express')
const app  = express()
const cors = require('cors')
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// env configuration
require('dotenv').config({ quiet: true})

app.use(cors({
    origin: process.env.BACKEND_URL,
    credentials: true               
  }))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


app.post('/',async (req,res)=>{
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: "missing fields" });
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: process.env.GOOGLE_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ID,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `ShopZilla <${process.env.GMAIL_ID}>`,
      to: email,
      subject,
      text: message,
    });

    res.status(200).json({ success: true,message: ''});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "failed to send email" });
  }
})

app.listen(process.env.PORT,()=>{
    console.log(`server is listening on http://localhost:${process.env.PORT}`);
})
