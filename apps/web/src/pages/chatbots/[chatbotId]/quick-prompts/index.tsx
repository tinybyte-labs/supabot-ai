import DashboardPageHeader from "@/components/DashboardPageHeader";
import AddQuickPromptModal from "@/components/modals/AddQuickPrompt";
import UpdateQuickPromptModal from "@/components/modals/UpdateQuickPromptModal";
import { useModal } from "@/components/modals/useModal";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { QuickPrompt } from "@acme/db";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreHorizontal, Plus, RotateCw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const columns: ColumnDef<QuickPrompt>[] = [
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
    accessorKey: "title",
    header: () => <div className="whitespace-nowrap">TITLE</div>,
    cell: ({ row }) => (
      <p className="min-w-[160px] max-w-sm">{row.original.title}</p>
    ),
  },
  {
    accessorKey: "prompt",
    header: () => <div className="whitespace-nowrap">PROMPT</div>,
    cell: ({ row }) => <p className="min-w-[320px]">{row.original.prompt}</p>,
  },
  {
    accessorKey: "status",
    header: () => <div className="whitespace-nowrap">STATUS</div>,
  },
  {
    accessorKey: "isFollowUpPrompt",
    header: () => <div className="whitespace-nowrap">FOLLOW UP</div>,
    cell: ({ row }) => (
      <Checkbox checked={row.original.isFollowUpPrompt} aria-readonly />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="whitespace-nowrap">LAST UPDATED AT</div>,
    cell: ({ row }) => {
      return (
        <p className="whitespace-nowrap">
          {row.original.updatedAt
            ? formatDistanceToNow(row.original.updatedAt, {
                addSuffix: true,
              })
            : "-"}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      return <ActionButton quickPrompt={row.original} />;
    },
  },
];

const QuickPromptsPage: NextPageWithLayout = () => {
  const [Modal, { openModal }] = useModal(AddQuickPromptModal);
  const { isLoaded, chatbot } = useChatbot();
  const quickPromptsQuery = trpc.quickPrompt.list.useQuery(
    { chatbotId: chatbot?.id || "" },
    { enabled: isLoaded },
  );
  const { toast } = useToast();

  const deleteMany = trpc.quickPrompt.deleteMany.useMutation({
    onSuccess: (data) => {
      toast({ title: `${data.count} prompt(s) deleted` });
      table.resetRowSelection();
      quickPromptsQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isBusey = useMemo(
    () =>
      deleteMany.isLoading ||
      quickPromptsQuery.isRefetching ||
      quickPromptsQuery.isLoading,
    [
      deleteMany.isLoading,
      quickPromptsQuery.isLoading,
      quickPromptsQuery.isRefetching,
    ],
  );

  const table = useReactTable({
    data: quickPromptsQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const onDeleteMany = useCallback(() => {
    if (!chatbot) return;
    const selectedQuickPrompts = table.getSelectedRowModel().rows;
    deleteMany.mutate(selectedQuickPrompts.map((prompt) => prompt.original.id));
  }, [chatbot, deleteMany, table]);

  return (
    <>
      <DashboardPageHeader title="Quick Prompts">
        {quickPromptsQuery.isLoading ? (
          <>
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </>
        ) : table.getSelectedRowModel().rows.length > 0 ? (
          <>
            <p className="text-muted-foreground mr-2 text-sm">
              {table.getSelectedRowModel().rows.length} row(s) selected
            </p>
            <Button
              disabled={isBusey}
              variant="destructive"
              onClick={onDeleteMany}
            >
              {deleteMany.isLoading ? (
                <Loader2 size={18} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <Trash2 size={18} className="-ml-1 mr-2" />
              )}
              Delete Prompt(s)
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={isBusey}
              variant="outline"
              onClick={() => quickPromptsQuery.refetch()}
            >
              {quickPromptsQuery.isRefetching ? (
                <Loader2 size={18} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <RotateCw size={18} className="-ml-1 mr-2" />
              )}
              Refresh
            </Button>
            <Button disabled={isBusey} onClick={openModal}>
              <Plus size={18} className="-ml-1 mr-2" />
              Add Prompt
            </Button>
          </>
        )}
      </DashboardPageHeader>

      <div className="container">
        {quickPromptsQuery.isLoading ? (
          <div className="flex items-center justify-center rounded-lg border py-32">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>
      <Modal />
    </>
  );
};

QuickPromptsPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default QuickPromptsPage;

const ActionButton = ({ quickPrompt }: { quickPrompt: QuickPrompt }) => {
  const utils = trpc.useContext();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const deletePrompt = trpc.quickPrompt.delete.useMutation({
    onSuccess: () => {
      utils.quickPrompt.list.invalidate({ chatbotId: quickPrompt.chatbotId });
      toast({ title: "Prompt deleted" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions {quickPrompt.id}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deletePrompt.isLoading}
            onClick={() => deletePrompt.mutate(quickPrompt.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateQuickPromptModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prompt={quickPrompt}
      />
    </>
  );
};
