import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { VerifyOtpEmail } from "@/emails/layoutEmail";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
) => {
  try {
    const html = await render(
      <VerifyOtpEmail username={username} otp={otp} />
    );

    await resend.emails.send({
      from: "A.H Handicraft <support@ahhandicraft.store>",
      to: email,
      subject: "Verify Your Email Address",
      html,
    });

    return { success: true };
  } catch (error) {
    throw new Error("Failed to Send Verification Email!");
  }
};
