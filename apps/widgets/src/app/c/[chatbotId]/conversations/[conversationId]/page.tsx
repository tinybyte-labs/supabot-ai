import BodyContainer from "@/components/BodyContainer";
import MessageInputForm from "./MessageInputForm";
import MessagesList from "./MessagesList";
import Header from "./Header";

export default async function ConversationPage() {
  return (
    <>
      <Header />
      <BodyContainer>
        <MessagesList />
        <div className="p-4">
          <MessageInputForm />
        </div>
      </BodyContainer>
    </>
  );
}
