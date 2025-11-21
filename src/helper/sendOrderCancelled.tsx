import nodemailer from "nodemailer";
import { OrderCancelledEmail } from "@/emails/OrderCancelledEmail";
import { render } from "@react-email/render";

export const sendOrderCancelledEmail = async (
  email: string,
  username: string,
  msg: string,
  orderId: string
) => {
  try {
    const emailHtml = await render(
      <OrderCancelledEmail username={username} msg={msg} orderId={orderId} />
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
      subject: `Order #${orderId} Cancelled`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Cancel email error:", error);
    throw new Error("Failed to send cancellation email!");
  }
};
