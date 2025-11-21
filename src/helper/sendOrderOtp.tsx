import nodemailer from "nodemailer";
import { OrderOtpEmail } from "@/emails/OrderOtpEmail";
import { render } from "@react-email/render";

export const sendOrderOtpEmail = async (
  email: string,
  username: string,
  otp: string,
  orderId: string
) => {
  try {
    const emailHtml = await render(
      <OrderOtpEmail username={username} otp={otp} orderId={orderId} />
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"A.H Handicraft" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Verification OTP — #${orderId}`,
      html: emailHtml,
    });

  } catch (error) {
    console.error(error);
    throw new Error("Failed to send OTP email for Order!");
  }
};
