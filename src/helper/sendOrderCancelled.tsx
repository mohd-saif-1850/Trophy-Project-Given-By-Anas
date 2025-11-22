import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { OrderCancelledEmail } from "@/emails/OrderCancelledEmail";

export const sendOrderCancelledEmail = async (
  email: string,
  username: string,
  msg: string,
  orderId: string
) => {
  try {
    const html = await render(
      <OrderCancelledEmail 
        username={username} 
        msg={msg} 
        orderId={orderId} 
      />
    );

    await resend.emails.send({
      from: "A.H Handicraft <onboarding@resend.dev>",
      to: email,
      subject: `Order #${orderId} Cancelled`,
      html,
    });

    return { success: true, message: "Order cancellation email sent" };
  } catch (error) {
    throw new Error("Failed to send cancellation email!");
  }
};
