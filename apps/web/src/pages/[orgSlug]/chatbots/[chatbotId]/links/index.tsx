import DashboardPageHeader from "@/components/DashboardPageHeader";
import AddLinksModal from "@/components/modals/AddLinksModal";
import { useModal } from "@/components/modals/useModal";
import { DataTable } from "@/components/tables/DataTable";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useChatbot } from "@/hooks/useChatbot";
import ChatbotLayout from "@/layouts/ChatbotLayout";
import { NextPageWithLayout } from "@/types/next";
import { trpc } from "@/utils/trpc";
import { Link as LinkTable } from "@acme/db";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2Icon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCwIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

const LinksPage: NextPageWithLayout = () => {
  const { toast } = useToast();
  const [Modal, { openModal }] = useModal(AddLinksModal);
  const { data: chatbot, isSuccess: isChatbotLoaded } = useChatbot();
  const [isRetrainingLinks, setIsRetrainingLinks] = useState(false);
  const [isDeleteingLinks, setIsDeleteingLinks] = useState(false);

  const linksQuery = trpc.link.getLinksForChatbot.useQuery(
    { chatbotId: chatbot?.id || "" },
    { enabled: isChatbotLoaded },
  );
  const retrainLinkMutation = trpc.link.retrainLink.useMutation();
  const deleteLinkMutation = trpc.link.deleteLink.useMutation();

  const table = useReactTable({
    data: linksQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const retrainSelectedLinks = useCallback(async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    setIsRetrainingLinks(true);
    try {
      await Promise.all(
        selectedRows.map(async (row) =>
          retrainLinkMutation.mutateAsync({ linkId: row.original.id }),
        ),
      );
      toast({ title: `${selectedRows.length} link(s) added to queue` });
      table.resetRowSelection();
      linksQuery.refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsRetrainingLinks(false);
    }
  }, [linksQuery, retrainLinkMutation, table, toast]);

  const deleteSelectedLinks = useCallback(async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    setIsDeleteingLinks(true);
    try {
      await Promise.all(
        selectedRows.map(async (row) =>
          deleteLinkMutation.mutateAsync({ linkId: row.original.id }),
        ),
      );
      toast({ title: `${selectedRows.length} links deleted` });
      table.resetRowSelection();
      linksQuery.refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsDeleteingLinks(false);
    }
  }, [deleteLinkMutation, linksQuery, table, toast]);

  return (
    <>
      <DashboardPageHeader title="Links">
        {linksQuery.isLoading ? (
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
              disabled={isRetrainingLinks}
              variant="secondary"
              onClick={retrainSelectedLinks}
            >
              {isRetrainingLinks ? (
                <Loader2Icon size={18} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <RotateCwIcon size={18} className="-ml-1 mr-2" />
              )}
              Retrain Link(s)
            </Button>
            <Button
              disabled={isDeleteingLinks}
              variant="destructive"
              onClick={deleteSelectedLinks}
            >
              {isDeleteingLinks ? (
                <Loader2Icon size={18} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <Trash2Icon size={18} className="-ml-1 mr-2" />
              )}
              Delete Link(s)
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={linksQuery.isRefetching}
              variant="outline"
              onClick={() => linksQuery.refetch()}
            >
              {linksQuery.isRefetching ? (
                <Loader2Icon size={18} className="-ml-1 mr-2 animate-spin" />
              ) : (
                <RefreshCwIcon size={18} className="-ml-1 mr-2" />
              )}
              Refresh
            </Button>
            <Button onClick={openModal}>
              <PlusIcon size={18} className="-ml-1 mr-2" />
              Add Link
            </Button>
          </>
        )}
      </DashboardPageHeader>
      <div className="container">
        {linksQuery.isLoading ? (
          <div className="flex items-center justify-center rounded-lg border py-32">
            <Loader2Icon size={24} className="animate-spin" />
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
  },
  {
    accessorKey: "lastTrainedAt",
    header: () => <div className="whitespace-nowrap">LAST TRAINED AT</div>,
    cell: ({ row }) => {
      return (
        <p className="whitespace-nowrap">
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
  const deleteLink = trpc.link.deleteLink.useMutation({
    onSuccess: () => {
      utils.link.getLinksForChatbot.invalidate({ chatbotId: link.chatbotId });
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
  const retrainLink = trpc.link.retrainLink.useMutation({
    onSuccess: () => {
      utils.link.getLinksForChatbot.invalidate({ chatbotId: link.chatbotId });
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
          <MoreHorizontalIcon className="h-4 w-4" />
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
          onClick={() => retrainLink.mutate({ linkId: link.id })}
        >
          Retrain
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={deleteLink.isLoading || retrainLink.isLoading}
          onClick={() => deleteLink.mutate({ linkId: link.id })}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
