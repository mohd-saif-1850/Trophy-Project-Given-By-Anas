import * as React from "react";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

interface ForgotPasswordEmailProps {
  name: string;
  otp: string;
}

export const ForgotPasswordEmail = ({ name, otp }: ForgotPasswordEmailProps) => {
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
          {/* HEADER */}
          <Section
            style={{
              background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
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

          {/* BODY CONTENT */}
          <Section style={{ padding: "35px 30px", textAlign: "center" }}>
            <Text style={{ fontSize: "17px", color: "#333", marginBottom: "10px" }}>
              Hi <strong>{name}</strong>,
            </Text>

            <Text style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
              We received a request to reset your password.  
              Use the One-Time Password (OTP) below to proceed.
            </Text>

            <div
              style={{
                display: "inline-block",
                background: "#f0f4ff",
                border: "2px solid #2563eb",
                borderRadius: "12px",
                padding: "15px 30px",
                fontSize: "32px",
                fontWeight: "bold",
                color: "#2563eb",
                letterSpacing: "10px",
                marginBottom: "25px",
              }}
            >
              {otp}
            </div>

            <Text style={{ fontSize: "15px", color: "#555" }}>
              This OTP will expire in <strong>10 minutes</strong>.  
              Please use it soon to reset your password.
            </Text>

            <Text style={{ fontSize: "14px", color: "#777", marginTop: "15px" }}>
              If you didn’t request this password reset,  
              you can safely ignore this email — your account will remain secure.
            </Text>
          </Section>

          {/* FOOTER */}
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
                  color: "#2563eb",
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
