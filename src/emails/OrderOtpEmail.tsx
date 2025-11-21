import * as React from "react";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

interface OrderOtpEmailProps {
  username: string;
  otp: string;
  orderId: string;
}

export const OrderOtpEmail = ({ username, otp, orderId }: OrderOtpEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f4f6fb",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          margin: 0,
          padding: "30px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              color: "#fff",
              textAlign: "center",
              padding: "35px 0",
            }}
          >
            <Text
              style={{
                fontSize: "28px",
                fontWeight: "700",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              AH Handicraft
            </Text>

            <Text
              style={{
                fontSize: "16px",
                opacity: 0.9,
                marginTop: "6px",
              }}
            >
              Order Completion Verification
            </Text>
          </Section>

          <Section style={{ padding: "35px 30px", textAlign: "center" }}>
            <Text
              style={{
                fontSize: "17px",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Hello <strong>{username}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "16px",
                color: "#555",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              Your order <strong>#{orderId}</strong> is ready to be marked as
              <strong> Completed</strong>. To confirm this action, please use the OTP below.
            </Text>

            <div
              style={{
                display: "inline-block",
                background: "#eef3ff",
                border: "2px solid #3b5bdb",
                borderRadius: "12px",
                padding: "18px 35px",
                fontSize: "34px",
                fontWeight: "bold",
                color: "#3b5bdb",
                letterSpacing: "10px",
                marginBottom: "28px",
              }}
            >
              {otp}
            </div>

            <Text style={{ fontSize: "15px", color: "#444" }}>
              This OTP will remain valid for <strong>10 minutes</strong>.
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#777",
                marginTop: "12px",
              }}
            >
              If you did not request this verification, please ignore this message.
            </Text>
          </Section>

          <Section
            style={{
              textAlign: "center",
              background: "#f9fafc",
              padding: "20px",
              borderTop: "1px solid #eee",
            }}
          >
            <Text style={{ fontSize: "13px", color: "#888" }}>
              © {new Date().getFullYear()}{" "}
              <a
                href="#"
                style={{
                  color: "#3b5bdb",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                AH Handicraft
              </a>{" "}
              — All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
