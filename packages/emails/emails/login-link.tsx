import { Body, Text } from "@react-email/components";

export default function LogInLink({
  url = "http://localhost:3000/api/auth/callback/email?callbackUrl=...",
  email = "email@example.com",
}: {
  url: string;
  email: string;
}) {
  return (
    <Body>
      <Text>Your log in link {url}</Text>
      <Text>This email is for {email}</Text>
    </Body>
  );
}
