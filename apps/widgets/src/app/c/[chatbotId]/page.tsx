import StartConversationForm from "./StartConversationForm";
import BodyContainer from "@/components/BodyContainer";
import BaseHeader from "@/components/BaseHeader";
import WelcomeMessage from "./WelcomeMessage";

export default async function Page() {
  return (
    <>
      <BaseHeader />
      <WelcomeMessage />
      <BodyContainer>
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:container sm:mx-auto sm:max-w-screen-sm sm:py-16">
          <StartConversationForm />
        </div>
      </BodyContainer>
    </>
  );
}
