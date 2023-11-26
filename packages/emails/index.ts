import { Resend } from "resend";
import WelcomeEmail from "./emails/welcome";
import OrganizationInvite from "./emails/organization-invite";
import LogInLink from "./emails/login-link";

export { WelcomeEmail, OrganizationInvite, LogInLink };

export const resend = new Resend(process.env.RESEND_API_KEY);
