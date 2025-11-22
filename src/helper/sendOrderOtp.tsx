import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { OrderOtpEmail } from "@/emails/OrderOtpEmail";

export const sendOrderOtpEmail = async (
  email: string,
  username: string,
  otp: string,
  orderId: string
) => {
  try {
    const html = await render(
      <OrderOtpEmail username={username} otp={otp} orderId={orderId} />
    );

    await resend.emails.send({
      from: "A.H Handicraft <support@ahhandicraft.store>",
      to: email,
      subject: `Order Verification OTP — #${orderId}`,
      html,
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to send OTP email for Order!");
  }
};
