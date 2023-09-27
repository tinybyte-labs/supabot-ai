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
  Hr,
  Img,
} from "@react-email/components";

const APP_NAME = "SupaBot AI";
const BASE_URL = "https://supabotai.com";

const WelcomeEmail = ({ email = "jhon@example.com" }: { email: string }) => {
  return (
    <Html>
      <Head>
        <title>Welcome to {APP_NAME} 👋</title>
      </Head>
      <Preview>Welcome to {APP_NAME} 👋</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-16 w-[512px] rounded-lg border border-solid border-zinc-200 p-8">
            <Section>
              <Img
                src={`${BASE_URL}/brand-icon.png`}
                alt={`${APP_NAME} icon`}
                width={64}
                className="mx-auto mb-4"
              />
              <Text className="text-center text-xl font-bold leading-none">
                Welcome to {APP_NAME}
              </Text>
            </Section>

            <Section>
              <Text>Thanks for signing up!</Text>
              <Text>
                My name is Rohid. I&apos;m the founder of {APP_NAME}. I&apos;m
                super excited to have you on board!
              </Text>
            </Section>
            <Section>
              <Text>Here are a few things you can do:</Text>
              <Text className="my-2 pl-2">
                🤖 Create a{" "}
                <Link href={`${BASE_URL}/chatbots/new`}>new chatbot</Link> and
                start adding links
              </Text>
              <Text className="my-2 pl-2">
                🐣 Follow us on{" "}
                <Link href={`${BASE_URL}/twitter`}>Twitter</Link>
              </Text>
              <Text className="my-2 pl-2">
                ⭐ Star us on <Link href={`${BASE_URL}/github`}>GitHub</Link>
              </Text>
              <Text className="my-2 pl-2">
                🚀 Visit our website <Link href={BASE_URL}>{APP_NAME}</Link>
              </Text>
            </Section>
            <Text>
              Let me know if you have any questions or feedback. I&apos;m always
              happy to help!
            </Text>
            <Text className="text-zinc-400">Rohid from {APP_NAME}</Text>
            <Hr />
            <Text className="text-sm text-zinc-400">
              This email was intended for{" "}
              <Link href={`mailto:${email}`}>{email}</Link>. If you were not
              expecting this email, you can ignore this email. If you don&apos;t
              want to receive emails like this in the future, you can{" "}
              <Link
                href="{{{RESEND_UNSUBSCRIBE_URL}}}"
                className="text-gray-600"
              >
                unsubscribe here
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
