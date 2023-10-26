"use client";

export default function CloseChatboxButton() {
  return (
    <button
      className="hover:opacity-80"
      onClick={() => {
        window.parent.postMessage("CLOSE_CHATBOX", "*");
      }}
    >
      <div className="sr-only">Close Chatbox</div>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 7L7 17M7 7L17 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
