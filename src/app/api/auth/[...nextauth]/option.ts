import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Mobile Number",
          type: "text",
          placeholder: "Enter your email or number",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your email/number and password.");
        }

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { mobileNumber: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("User not found. Please sign up first.");
        }

        if (!user.verified) {
          throw new Error("Please verify your email before logging in.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password.");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.mobileNumber = user.mobileNumber;
        token.verified = user.verified;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.mobileNumber = token.mobileNumber;
        session.user.verified = token.verified;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
