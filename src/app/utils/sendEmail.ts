import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(to)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: config.email, 
      pass: config.email_password, 
    },
  });

  const mailOptions = {
    from: config.email,
    to,
    subject,
    text,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
