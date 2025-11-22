import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { ForgotPasswordEmail } from "@/emails/ForgotPasswordEmail";

export const sendForgotPasswordEmail = async (
  email: string,
  name: string,
  otp: string
) => {
  try {
    const emailHtml = await render(
      <ForgotPasswordEmail name={name} otp={otp} />
    );

    await resend.emails.send({
      from: "A.H Handicraft <support@ahhandicraft.store>",
      to: email,
      subject: "Reset Your Password - OTP Verification",
      html: emailHtml,
    });
  } catch (error) {
    throw new Error("Failed to Send Forgot Password Email !");
  }
};
