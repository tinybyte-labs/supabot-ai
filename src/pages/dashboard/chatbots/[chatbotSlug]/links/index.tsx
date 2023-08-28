import PageHeader from "@/components/PageHeader";
import AddLinksModal from "@/components/modals/AddLinksModal";
import { useModal } from "@/components/modals/useModal";
import { DataTable } from "@/components/tables/LinksTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { useChatbot } from "@/providers/ChatbotProvider";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Link as LinkTable } from "@prisma/client";
import {
  ColumnDef,
  RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Loader, Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const LinksPage: NextPageWithLayout = () => {
  const [Modal, { openModal }] = useModal(AddLinksModal);
  const { isLoaded, chatbot } = useChatbot();
  const linksQuery = trpc.link.list.useQuery(
    { chatbotId: chatbot?.id || "" },
    { enabled: isLoaded },
  );
  const data = useMemo(() => linksQuery.data || [], [linksQuery.data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const { toast } = useToast();

  const retrainMany = trpc.link.retrainMany.useMutation({
    onSuccess: (data) => {
      toast({ title: `${data.length} links added to training` });
      table.resetRowSelection();
      linksQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMany = trpc.link.deleteMany.useMutation({
    onSuccess: (data) => {
      toast({ title: `${data.count} links deleted` });
      table.resetRowSelection();
      linksQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onRetrainMany = () => {
    if (!chatbot) return;
    const links = table.getSelectedRowModel().rows;
    retrainMany.mutate({
      chatbotId: chatbot.id,
      linkIds: links.map((link) => link.original.id),
    });
  };

  const onDeleteMany = () => {
    if (!chatbot) return;
    const links = table.getSelectedRowModel().rows;
    deleteMany.mutate({
      chatbotId: chatbot.id,
      linkIds: links.map((link) => link.original.id),
    });
  };

  return (
    <>
      <PageHeader title="Links">
        <div className="flex items-center gap-2">
          {table.getSelectedRowModel().rows.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {table.getSelectedRowModel().rows.length} rows selected
              </p>
              <Button
                disabled={retrainMany.isLoading || deleteMany.isLoading}
                variant="secondary"
                onClick={onRetrainMany}
              >
                {retrainMany.isLoading && (
                  <Loader2 size={18} className="-ml-1 mr-2 animate-spin" />
                )}
                Retrain Link(s)
              </Button>
              <Button
                disabled={retrainMany.isLoading || deleteMany.isLoading}
                variant="destructive"
                onClick={onDeleteMany}
              >
                {deleteMany.isLoading && (
                  <Loader2 size={18} className="-ml-1 mr-2 animate-spin" />
                )}
                Delete Link(s)
              </Button>
            </>
          ) : (
            <Button
              disabled={retrainMany.isLoading || deleteMany.isLoading}
              onClick={openModal}
            >
              Add Link
            </Button>
          )}
        </div>
      </PageHeader>
      <div className="container my-16 space-y-8">
        {linksQuery.isLoading ? (
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

LinksPage.getLayout = (page) => <ChatbotLayout>{page}</ChatbotLayout>;

export default LinksPage;

export const columns: ColumnDef<LinkTable>[] = [
  {
    id: "select",
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "url",
    header: () => <div>URL</div>,
    cell: ({ row }) => {
      return (
        <Link href={row.original.url} target="_blank">
          {row.original.url}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>STATUS</div>,
    cell: ({ row }) => {
      return <p>{row.original.status}</p>;
    },
  },
  {
    accessorKey: "lastTrainedAt",
    header: () => <div>LAST TRAINED AT</div>,
    cell: ({ row }) => {
      return (
        <p>
          {row.original.lastTrainedAt
            ? formatDistanceToNow(row.original.lastTrainedAt, {
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
      return <ActionButton link={row.original} />;
    },
  },
];

const ActionButton = ({ link }: { link: LinkTable }) => {
  const utils = trpc.useContext();
  const { toast } = useToast();
  const deleteLink = trpc.link.delete.useMutation({
    onSuccess: () => {
      utils.link.list.invalidate();
      toast({ title: "Link delete success" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const retrainLink = trpc.link.retrain.useMutation({
    onSuccess: () => {
      utils.link.list.invalidate();
      toast({ title: "Successfully added to queue" });
    },
    onError: (error) => {
      toast({
        title: "Error while retrain",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={link.url} target="_blank">
            Open Link
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={deleteLink.isLoading || retrainLink.isLoading}
          onClick={() =>
            retrainLink.mutate({ chatbotId: link.chatbotId, linkId: link.id })
          }
        >
          Retrain
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={deleteLink.isLoading || retrainLink.isLoading}
          onClick={() =>
            deleteLink.mutate({ chatbotId: link.chatbotId, linkId: link.id })
          }
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
