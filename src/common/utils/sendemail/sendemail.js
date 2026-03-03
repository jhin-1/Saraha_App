import nodemailer from "nodemailer";
import { env } from "../../../../config/index.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject,
    text,
    html: `<p>${text}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
};