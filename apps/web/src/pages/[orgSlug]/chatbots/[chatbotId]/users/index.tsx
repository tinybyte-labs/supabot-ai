import DashboardPageHeader from "@/components/DashboardPageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useChatbot } from "@/hooks/useChatbot";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { ChatbotUser } from "@acme/db";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, MoreHorizontal, RefreshCw } from "lucide-react";
import { useMemo } from "react";

type Data = ChatbotUser & { _count: { conversations: number } };

const columns: ColumnDef<Data>[] = [
  // {
  //   id: "select",
  //   enableSorting: false,
  //   enableHiding: false,
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
  {
    accessorKey: "id",
    header: () => <div>ID</div>,
  },
  {
    accessorKey: "name",
    header: () => <div>NAME</div>,
  },
  {
    accessorKey: "email",
    header: () => <div>EMAIL</div>,
  },
  {
    id: "conversations",
    header: () => <div>Conversations</div>,
    cell: ({ row }) => <div>{row.original._count.conversations || "0"}</div>,
  },
  {
    accessorKey: "blocked",
    header: () => <div>Blocked</div>,
    cell: ({ row }) => (
      <Checkbox checked={row.original.blocked} aria-readonly />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <ActionButton data={row.original} />;
    },
  },
];

const ActionButton = ({ data }: { data: Data }) => {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const blockMutation = trpc.chatbotUser.blockUser.useMutation({
    onSuccess(data) {
      toast({
        title: "Success",
        description: `${data.id} has been ${
          data.blocked ? "blocked" : "unblocked"
        }`,
      });
      utils.chatbotUser.list.invalidate();
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleBlock = () =>
    blockMutation.mutate({ userId: data.id, blocked: !data.blocked });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={toggleBlock}
          disabled={blockMutation.isLoading}
        >
          {data.blocked ? "Unblock User" : "Block User"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ChatbotUsersPage: NextPageWithLayout = () => {
  const { data: chatbot, isSuccess: isChatbotLoaded } = useChatbot();
  const chatbotUsersQuery = trpc.chatbotUser.list.useQuery(
    { chatbotId: chatbot?.id || "" },
    { enabled: isChatbotLoaded },
  );

  const data = useMemo(
    () => chatbotUsersQuery.data || [],
    [chatbotUsersQuery.data],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <DashboardPageHeader title="Users">
        <Button
          disabled={chatbotUsersQuery.isLoading}
          variant="outline"
          onClick={() => chatbotUsersQuery.refetch()}
        >
          {chatbotUsersQuery.isRefetching ? (
            <Loader2 size={18} className="-ml-1 mr-2 animate-spin" />
          ) : (
            <RefreshCw size={18} className="-ml-1 mr-2" />
          )}
          Refresh
        </Button>
      </DashboardPageHeader>

      <div className="container">
        {chatbotUsersQuery.isLoading ? (
          <div className="flex items-center justify-center rounded-lg border py-32">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </>
  );
};

ChatbotUsersPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ChatbotUsersPage;
