import nodemailer from "nodemailer";
import { env } from "../../../../config/index.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});


export const sendEmail = async({to,subject,html})=>{
  const info = await transporter.sendMail({
    from: `"Ahmed Yosri" <${env.EMAIL_USER}>`, // sender address
    to,
    subject,
    html
  })
  console.log("Message sent: %s", info.messageId);
  }


