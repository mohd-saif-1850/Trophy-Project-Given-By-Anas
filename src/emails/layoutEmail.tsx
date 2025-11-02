import * as React from "react";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

interface VerifyOtpEmailProps {
  username: string;
  otp: string;
}

export const VerifyOtpEmail = ({ username, otp }: VerifyOtpEmailProps) => {
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
              background: "linear-gradient(135deg, #007bff, #6610f2)",
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
          </Section>

          <Section style={{ padding: "35px 30px", textAlign: "center" }}>
            <Text style={{ fontSize: "17px", color: "#333", marginBottom: "10px" }}>
              Hi <strong>{username}</strong>,
            </Text>
            <Text style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
              Use the One-Time Password (OTP) below to verify your email address.
            </Text>

            <div
              style={{
                display: "inline-block",
                background: "#f0f4ff",
                border: "2px solid #0b6efd",
                borderRadius: "12px",
                padding: "15px 30px",
                fontSize: "32px",
                fontWeight: "bold",
                color: "#0b6efd",
                letterSpacing: "10px",
                marginBottom: "25px",
              }}
            >
              {otp}
            </div>

            <Text style={{ fontSize: "15px", color: "#555" }}>
              This OTP will expire in <strong>10 minutes</strong>.
            </Text>
            <Text style={{ fontSize: "14px", color: "#777", marginTop: "10px" }}>
              If you didn’t request this, you can safely ignore this email.
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
                  color: "#0b6efd",
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
