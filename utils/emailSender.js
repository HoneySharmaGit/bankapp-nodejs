import nodemailer from "nodemailer";

// create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6dfda103efc6bb",
    pass: "0fe04341101636",
  },
});

// email content to send
const mailOptions = async (To, Subject, Text) => {
  return {
    from: "honey@myuniqpay.com",
    to: To,
    subject: Subject,
    text: Text,
  };
};

// code to send email
const sendEmail = async (To, Subject, Text) => {
  const options = await mailOptions(To, Subject, Text);
  await transporter.sendMail(options);
  console.log("email sent successfully...");
};

const EmailService = { mailOptions, sendEmail };

export default EmailService;
