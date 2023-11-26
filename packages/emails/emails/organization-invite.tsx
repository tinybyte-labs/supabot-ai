import {
  Html,
  Head,
  Preview,
  Body,
  Link,
  Tailwind,
  Container,
  Text,
  Section,
  Heading,
} from "@react-email/components";

const APP_NAME = "SupaBot AI";

export default function OrganizationInvite({
  email = "email@example.com",
  url = `http://localhost:3000/api/auth/callback/email?callbackUrl=...`,
  organizationName = "Acme",
  organizationUser = "John Doe",
  organizationUserEmail = "john@example.com",
}: {
  email: string;
  url: string;
  organizationName: string;
  organizationUser: string | null;
  organizationUserEmail: string | null;
}) {
  return (
    <Html>
      <Head>
        <title>Welcome to {APP_NAME} 👋</title>
      </Head>
      <Preview>Welcome to {APP_NAME} 👋</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-16 w-[512px] rounded-lg border border-solid border-zinc-200 p-8">
            <Heading>
              Join {organizationName} on {APP_NAME}
            </Heading>
            {organizationUser && organizationUserEmail ? (
              <Text>
                <strong>{organizationUser}</strong>(
                <Link href={`mailto:${organizationUserEmail}`}>
                  {organizationUserEmail}
                </Link>
                ) has invited you to join the{" "}
                <strong>{organizationName}</strong> organization on {APP_NAME}!
              </Text>
            ) : (
              <Text>
                You have been invited to join the{" "}
                <strong>{organizationName}</strong> organization on {APP_NAME}!
              </Text>
            )}

            <Section className="mb-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Join Project
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, "")}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
