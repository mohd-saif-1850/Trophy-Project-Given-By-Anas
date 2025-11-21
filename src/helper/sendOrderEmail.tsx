import nodemailer from "nodemailer";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import { render } from "@react-email/render";

export const sendOrderConfirmationEmail = async (
  email: string,
  username: string,
  order: any
) => {
  try {
    const emailHtml = await render(
      <OrderConfirmationEmail username={username} order={order} />
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
      subject: "Your Order Confirmation",
      html: emailHtml,
    });

  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
    throw new Error("Email send failed");
  }
};
