import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Row,
  Column,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  username: string;
  order: any;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

export const OrderConfirmationEmail = ({
  username,
  order,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f4f6fb",
          padding: "30px 0",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "14px",
            margin: "0 auto",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}
          <Section
            style={{
              background: "linear-gradient(135deg, #007bff, #6610f2)",
              padding: "35px 0",
              textAlign: "center",
              color: "white",
            }}
          >
            <Text style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
              AH Handicraft
            </Text>
            <Text style={{ opacity: 0.9, marginTop: "4px" }}>
              Order Confirmation
            </Text>
          </Section>

          {/* GREETING */}
          <Section style={{ padding: "25px 30px" }}>
            <Text style={{ fontSize: "18px", marginBottom: "8px" }}>
              Hello <strong>{username}</strong>,
            </Text>

            <Text style={{ fontSize: "15px", color: "#444", marginBottom: 20 }}>
              Thank you for your order! Here are your order details:
            </Text>

            {/* ITEMS */}
            <Container
              style={{
                background: "#f9fafc",
                padding: 15,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Ordered Items
              </Text>

              {order.items.map((item: any, i: number) => (
                <Section
                  key={i}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: 12,
                    marginBottom: 12,
                  }}
                >
                  <Row>
                    <Column style={{ width: "80px" }}>
                      <Img
                        src={item.trophyId.image}
                        alt={item.trophyId.name}
                        width="70"
                        height="70"
                        style={{
                          borderRadius: 8,
                          border: "1px solid #ddd",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Column>

                    <Column style={{ paddingLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          marginBottom: 3,
                        }}
                      >
                        {item.trophyId.name}
                      </Text>

                      <Text style={{ fontSize: 14, color: "#555" }}>
                        Qty: {item.quantity}
                      </Text>

                      <Text style={{ fontSize: 14, color: "#555" }}>
                        Price: ₹{formatINR(item.price)}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Container>

            {/* SUMMARY */}
            <Section style={{ marginTop: 25 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Order Summary
              </Text>

              <Text style={{ fontSize: 15, color: "#444" }}>
                <strong>Total:</strong> ₹{formatINR(order.totalAmount)}
              </Text>

              <Text style={{ fontSize: 15, color: "#444", marginTop: 5 }}>
                <strong>Expected Delivery:</strong>{" "}
                {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
              </Text>
            </Section>
          </Section>

          {/* FOOTER */}
          <Section
            style={{
              background: "#f9fafc",
              padding: 15,
              textAlign: "center",
              borderTop: "1px solid #eee",
            }}
          >
            <Text style={{ fontSize: 12, color: "#888" }}>
              © {new Date().getFullYear()} AH Handicraft
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
