import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string,   message: string) => {

  const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: config.NODE_ENV === 'production',
   auth: {
    user: config.email,
    pass: config.email_password

   }, 
    });

    try{
      await transporter.sendMail({
        from: config.email,
        to,
        subject: "User Feedback Message",
        text: message,
      });
    }catch (error){
      console.log("Error sending email:", error);
    }
  };