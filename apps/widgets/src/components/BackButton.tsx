"use client";

import { useParams, useRouter } from "next/navigation";
import HeaderButton from "./HeaderButton";
import { ArrowLeftIcon } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const { chatbotId } = useParams();
  return (
    <HeaderButton
      onClick={() => {
        if (window.history.state && window.history.state.idx > 0) {
          router.back();
        } else {
          router.push(`/c/${chatbotId}`);
        }
      }}
    >
      <ArrowLeftIcon size={24} />
      <div className="sr-only">Go Back</div>
    </HeaderButton>
  );
}
