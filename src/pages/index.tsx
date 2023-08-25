import MarketingHeader from "@/components/MarketingHeader";
import { trpc } from "@/utils/trpc";

const Page = () => {
  const user = trpc.user.useQuery();
  return (
    <>
      <MarketingHeader />
      <pre>{JSON.stringify({ user: user.data?.userId }, null, 2)}</pre>
    </>
  );
};

export default Page;
