import { resend } from "@/lib/resend";
import { VerifyOtpEmail } from "@/emails/layoutEmail";
import { render } from "@react-email/render";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
) => {
  try {
    const emailHtml = await render(<VerifyOtpEmail username={username} otp={otp} />);

    await resend.emails.send({
      from: "A.H Handicraft <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email Address",
      html: emailHtml,
    });
  } catch (error) {
    throw new Error("Failed to Send Verification Email !");
  }
};
