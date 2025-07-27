const nodemailer = require('nodemailer')


const sendEmail = async (options)=>{
    const {email,subject,message} = options

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASS
        }
    })

    const mailOptions = {
        from: `shopzilla <${process.env.GMAIL_ID}>`,
        to: email,
        subject,
        text: message
    }

    await transporter.sendMail(mailOptions)
}



module.exports = sendEmail