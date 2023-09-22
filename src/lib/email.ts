import type { ReactElement } from "react";
import { Resend } from "resend";

import WelcomeEmail from "../../emails/welcome";

export { WelcomeEmail };

const resend = new Resend(process.env.RESEND_API_KEY);

export interface Emails {
  react: ReactElement;
  subject: string;
  to: string[];
  from: string;
}

export const sendEmail = async (email: Emails) => {
  await resend.emails.send(email);
};
