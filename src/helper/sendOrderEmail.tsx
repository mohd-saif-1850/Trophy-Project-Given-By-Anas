import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";

export const sendOrderConfirmationEmail = async (
  email: string,
  username: string,
  order: any
) => {
  try {
    const html = await render(
      <OrderConfirmationEmail username={username} order={order} />
    );

    await resend.emails.send({
      from: "A.H Handicraft <onboarding@resend.dev>",
      to: email,
      subject: "Your Order Confirmation",
      html,
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to send order confirmation email!");
  }
};
