import MessageInputForm from "./MessageInputForm";
import MessagesList from "./MessagesList";

export default async function ConversationPage() {
  return (
    <>
      <MessagesList />
      <div className="p-4">
        <MessageInputForm />
      </div>
    </>
  );
}
