import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";

const Page: NextPageWithLayout = (props) => {
  const {
    isLoading,
    isError,
    data: chatbots,
    error,
  } = trpc.chatbot.list.useQuery();
  const router = useRouter();
  const view = router.query.view as string;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <Head>
        <title>{`Chatbots - ${APP_NAME}`}</title>
      </Head>

      <PageHeader title="Chatbots" />

      <div className="container mb-32 mt-16">
        <Tabs
          value={new Set(["grid", "list"]).has(view) ? view : "grid"}
          className="space-y-8"
        >
          <div className="flex gap-4">
            <form className="relative flex-1">
              <Input
                type="text"
                placeholder="Search..."
                className="flex-1 pl-10"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </form>
            <TabsList className="max-md:hidden">
              <TabsTrigger value="grid" asChild>
                <Link
                  href={{
                    pathname: "/dashboard",
                    search: new URLSearchParams({ view: "grid" }).toString(),
                  }}
                >
                  <LayoutGrid size={20} />
                </Link>
              </TabsTrigger>
              <TabsTrigger value="list" asChild>
                <Link
                  href={{
                    pathname: "/dashboard",
                    search: new URLSearchParams({ view: "list" }).toString(),
                  }}
                >
                  <LayoutList size={20} />
                </Link>
              </TabsTrigger>
            </TabsList>
            <Button asChild className="whitespace-nowrap max-sm:hidden">
              <Link href="/dashboard/chatbots/new">
                <Plus size={20} className="-ml-1 mr-2" />
                Create Chatbot
              </Link>
            </Button>
            <Button asChild size="icon" className="whitespace-nowrap sm:hidden">
              <Link href="/dashboard/chatbots/new">
                <p className="sr-only">Create Chatbot</p>
                <Plus size={20} />
              </Link>
            </Button>
          </div>

          <TabsContent value="grid">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chatbots.map((chatbot) => (
                <Link
                  key={chatbot.id}
                  href={`/dashboard/chatbots/${chatbot.slug}`}
                  className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      {chatbot.image && <AvatarImage src={chatbot.image} />}
                      <AvatarFallback>
                        <Image
                          src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.slug}&size=128`}
                          width={128}
                          height={128}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{chatbot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {chatbot.slug}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {formatDistanceToNow(new Date(chatbot.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list">
            <div className="grid gap-6">
              {chatbots.map((chatbot) => (
                <Link
                  key={chatbot.id}
                  href={`/dashboard/chatbots/${chatbot.slug}`}
                  className="flex gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-lg md:items-center"
                >
                  <div className="flex flex-1 gap-4 max-md:flex-col md:items-center">
                    <div className="flex flex-1 items-center gap-4">
                      <Avatar className="h-10 w-10">
                        {chatbot.image && <AvatarImage src={chatbot.image} />}
                        <AvatarFallback>
                          <Image
                            src={`/api/avatar.svg?seed=${chatbot.id}&initials=${chatbot.slug}&size=128`}
                            width={128}
                            height={128}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <h3 className="truncate font-medium">{chatbot.name}</h3>
                        <p className="flex-1 truncate text-sm text-muted-foreground">
                          {chatbot.slug}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last updated{" "}
                        {formatDistanceToNow(new Date(chatbot.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/chatbots/${chatbot.slug}/conversations`}
                          >
                            Conversations
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/chatbots/${chatbot.slug}/links`}
                          >
                            Add Link
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/chatbots/${chatbot.slug}/settings`}
                          >
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
