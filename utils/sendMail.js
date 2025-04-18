const nodemailer= require('nodemailer');

const sendEmail = async (to, subject, html) => {

    const transporter= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.My_Mail,
            pass: process.env.App_Password
        }
    });

    const mailOptions={
        from: ' Flutter App',
        to, 
        subject,
        html
    };

    await transporter.sendMail(mailOptions);

}

module.exports= sendEmail;