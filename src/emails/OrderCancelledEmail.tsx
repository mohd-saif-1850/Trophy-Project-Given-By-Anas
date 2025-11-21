import * as React from "react";
import { Html, Head, Body, Container, Section, Text } from "@react-email/components";

interface OrderCancelledEmailProps {
  username: string;
  msg: string;
  orderId: string;
}

export const OrderCancelledEmail = ({ username, msg, orderId }: OrderCancelledEmailProps) => {
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
              background: "linear-gradient(135deg, #ff3b3b, #d40b0b)",
              color: "#fff",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            <Text style={{ fontSize: "26px", fontWeight: "700", margin: 0 }}>
              AH Handicraft
            </Text>
            <Text style={{ marginTop: "5px", opacity: 0.9 }}>Order Update</Text>
          </Section>

          <Section style={{ padding: "35px 30px", textAlign: "center" }}>
            <Text style={{ fontSize: "17px", color: "#333" }}>
              Hi <strong>{username}</strong>,
            </Text>

            <Text
              style={{
                fontSize: "15px",
                color: "#555",
                marginTop: "12px",
                lineHeight: "1.6",
              }}
            >
              Your order <strong>#{orderId}</strong> has been cancelled.
            </Text>

            <Text
              style={{
                background: "#ffe6e6",
                border: "1px solid #ff9d9d",
                padding: "15px",
                marginTop: "20px",
                borderRadius: "10px",
                fontSize: "15px",
                color: "#a10000",
                lineHeight: "1.6",
              }}
            >
              {msg}
            </Text>
          </Section>

          <Section
            style={{
              textAlign: "center",
              background: "#fafafa",
              padding: "18px",
              borderTop: "1px solid #eee",
            }}
          >
            <Text style={{ fontSize: "13px", color: "#888" }}>
              © {new Date().getFullYear()} AH Handicraft — All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
