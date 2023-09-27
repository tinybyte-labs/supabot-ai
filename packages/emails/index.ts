import { Resend } from "resend";
import WelcomeEmail from "./emails/welcome";
import * as React from "react";

export { WelcomeEmail };

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface Emails {
  react: React.ReactElement;
  subject: "Welcome to SupaBot AI 👋";
  to: string[];
  from: "Rohid <rohid@supabotai.com>";
}

export const sendEmail = async (email: Emails) => {
  await resend.emails.send(email);
};