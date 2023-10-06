import DemoChatbox from "../../DemoChatbox";

const Demo = () => {
  return (
    <section id="demo" className="py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-screen-md">
          <h2 className="text-center text-3xl font-bold opacity-90 md:text-5xl">
            Try Out Our Powerful Chatbot Demo{" "}
          </h2>
          <p className="mt-4 text-center font-medium opacity-70 md:text-lg">
            Step into the World of Seamless Conversations with Our Powerful
            Chatbot Demo
          </p>
        </div>
        <div className="relative mx-auto w-fit">
          <DemoChatbox />
          <div className="absolute -left-20 -top-10 -z-10 h-[300px] w-[300px] rotate-45 scale-125 rounded-[100px] bg-indigo-500/30 blur-[80px]"></div>
          <div className="absolute -right-32 bottom-40 -z-10 h-[300px] w-[300px] scale-y-125 rounded-[100px] bg-pink-500/30 blur-[100px]"></div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
