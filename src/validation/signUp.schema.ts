import { z } from "zod";

export const nameValidation = z
  .string()
  .min(3, "Name must be at least 3 characters long!")
  .max(30, "Name must not exceed 30 characters!");

export const mobileNumberValidation = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number!");

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address!" });

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters!" })
  .max(40, { message: "Password must not be more than 40 characters!" });

export const signUpSchema = z.object({
  name: nameValidation,
  mobileNumber: mobileNumberValidation,
  email: emailValidation,
  password: passwordValidation,
});
