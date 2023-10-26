"use client";

import { useParams, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const { chatbotId } = useParams();
  return (
    <button
      onClick={() => {
        router.back();
        localStorage.removeItem(`${chatbotId}.opened-conversation`);
      }}
    >
      <div className="sr-only">Go Back</div>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 12H4M4 12L10 18M4 12L10 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
