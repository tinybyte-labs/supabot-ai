import PageHeader from "@/components/PageHeader";
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
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Conversation, ChatbotUser } from "@prisma/client";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

type Data = Conversation & { user?: ChatbotUser | null };

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    header: () => <div>ID</div>,
  },
  {
    id: "user",
    header: () => <div>USER</div>,
    cell: ({ row }) => (
      <div>{row.original.user?.email || row.original.user?.id || "-"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="whitespace-nowrap">STARTED AT</div>,
    cell: ({ row }) => {
      return (
        <p className="whitespace-nowrap">
          {formatDistanceToNow(row.original.createdAt, {
            addSuffix: true,
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>STATUS</div>,
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
  const utils = trpc.useContext();
  const { toast } = useToast();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {data.status !== "CLOSED" && (
          <DropdownMenuItem>Close Conversation</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ConversationsPage: NextPageWithLayout = () => {
  const { isLoaded, chatbot } = useChatbot();
  const conversationsQuery = trpc.conversation.list.useQuery(
    {
      chatbotId: chatbot?.id || "",
    },
    { enabled: isLoaded },
  );

  const data = useMemo(
    () => conversationsQuery.data || [],
    [conversationsQuery.data],
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
      <PageHeader title="Conversations" />

      <div className="container mb-32 mt-8 md:mt-16">
        {conversationsQuery.isLoading ? (
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

ConversationsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default ConversationsPage;
