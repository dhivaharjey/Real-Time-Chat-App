import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendRsetLink = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL_ADDRESS,
      pass: process.env.USER_EMAIL_PASSWORD,
    },
  });
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const mailOptions = {
    to: email,
    subject: "Reset Password Link for REAL-TIME-CHAT -APP",
    text: `Click the following link to reset your password: ${resetLink} `,
  };
  console.log(mailOptions);

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error) {
      throw new Error("Could Not Send Reset Link");
    }
  }
};
