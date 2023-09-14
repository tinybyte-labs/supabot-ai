import DemoChatbox from "../../DemoChatbox";

const Demo = () => {
  return (
    <section id="demo" className="py-24">
      <div className="container">
        <div className="mx-auto mb-16 max-w-screen-md">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Try Out Our Powerful Chatbot Demo{" "}
          </h2>
          <p className="mt-4 text-center font-medium text-muted-foreground md:text-lg">
            Step into the World of Seamless Conversations with Our Powerful
            Chatbot Demo
          </p>
        </div>
        <div className="relative mx-auto w-fit">
          <DemoChatbox />
          <div className="absolute inset-0 -z-10 bg-foreground/5 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
