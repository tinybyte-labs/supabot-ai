export default function StartConversationForm() {
  return (
    <form>
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full rounded-xl bg-slate-100 p-4 placeholder-slate-400"
      />
      <input
        type="email"
        placeholder="Enter your name"
        className="mt-2 w-full rounded-xl bg-slate-100 p-4 placeholder-slate-400"
      />
      <button className="relative mt-4 flex w-full items-center justify-center rounded-xl bg-[var(--primary-bg)] p-4 text-center text-[var(--primary-fg)]">
        Start a conversation
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-6 top-1/2 -translate-y-1/2"
        >
          <path
            d="M4 12H20M20 12L14 6M20 12L14 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
