import { ModalFn } from "@/types/modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useCallback, useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Loader2Icon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "../tables/DataTable";
import { trpc } from "@/utils/trpc";
import { useChatbot } from "@/hooks/useChatbot";

const AddLinksModal: ModalFn = ({ onOpenChange, open }) => {
  const [isAddingUrls, setIsAddingUrls] = useState(false);

  const { data: chatbot } = useChatbot();
  const { toast } = useToast();

  const utils = trpc.useContext();
  const addLink = trpc.link.createLink.useMutation();

  const handleAddUrls = useCallback(
    async (urls: string[]) => {
      if (!chatbot) {
        return;
      }
      setIsAddingUrls(true);
      try {
        await Promise.all(
          urls.map(async (url) =>
            addLink.mutateAsync({ chatbotId: chatbot.id, url }),
          ),
        );
        toast({ title: `${urls.length} link(s) added to queue` });
        utils.link.getLinksForChatbot.invalidate({ chatbotId: chatbot.id });
        setIsAddingUrls(false);
        onOpenChange(false);
      } catch (error: any) {
        setIsAddingUrls(false);
        toast({
          title: "Error",
          description: error.message ?? "Something went wrong!",
          variant: "destructive",
        });
      }
    },
    [addLink, chatbot, onOpenChange, toast, utils.link.getLinksForChatbot],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Links</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="url" className="space-y-6">
          <TabsList>
            <TabsTrigger value="url">Url</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <LinksFromUrl onAddUrls={handleAddUrls} isAdding={isAddingUrls} />
          </TabsContent>
          <TabsContent value="website">
            <LinksFromWebsite
              onAddUrls={handleAddUrls}
              isAdding={isAddingUrls}
            />
          </TabsContent>
          <TabsContent value="sitemap">
            <LinksFromSitemap
              onAddUrls={handleAddUrls}
              isAdding={isAddingUrls}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinksModal;

const urlSchema = z.object({
  url: z.string().url(),
});

const LinksFromWebsite = ({
  onAddUrls,
  isAdding,
}: {
  onAddUrls: (urls: string[]) => void;
  isAdding?: boolean;
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const { toast } = useToast();
  const fetchLinks = trpc.utils.getLinksFromWebsite.useMutation({
    onSuccess: (data) => {
      setUrls(data);
      toast({ title: `${data.length} urls fetched` });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof urlSchema>) => {
    fetchLinks.mutate(data.url);
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              fetchLinks.isLoading || !form.formState.isValid || isAdding
            }
          >
            {fetchLinks.isLoading && (
              <Loader2Icon
                size={18}
                className="-ml-1 mr-2 h-4 w-4 animate-spin"
              />
            )}
            Fetch Urls
          </Button>
        </form>
      </Form>

      <UrlsTable
        onAddUrls={onAddUrls}
        urls={urls.map((url) => ({ url }))}
        isAdding={isAdding}
      />
    </div>
  );
};

const LinksFromSitemap = ({
  onAddUrls,
  isAdding,
}: {
  onAddUrls: (urls: string[]) => void;
  isAdding?: boolean;
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });
  const { toast } = useToast();

  const fetchLinks = trpc.utils.getLinksFromSitemap.useMutation({
    onSuccess: (data) => {
      setUrls(data);
      toast({ title: `${data.length} urls fetched` });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof urlSchema>) => {
    fetchLinks.mutate(data.url);
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="https://example.com/sitemap.xml"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              fetchLinks.isLoading || !form.formState.isValid || isAdding
            }
          >
            {fetchLinks.isLoading && (
              <Loader2Icon
                size={18}
                className="-ml-1 mr-2 h-4 w-4 animate-spin"
              />
            )}
            Fetch Urls
          </Button>
        </form>
      </Form>

      <UrlsTable
        onAddUrls={onAddUrls}
        urls={urls.map((url) => ({ url }))}
        isAdding={isAdding}
      />
    </div>
  );
};

const LinksFromUrl = ({
  onAddUrls,
  isAdding,
}: {
  onAddUrls: (urls: string[]) => void;
  isAdding?: boolean;
}) => {
  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof urlSchema>) => {
    onAddUrls([data.url]);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isAdding || !form.formState.isValid}
            >
              {isAdding && (
                <Loader2Icon
                  size={18}
                  className="-ml-1 mr-2 h-4 w-4 animate-spin"
                />
              )}
              Add Link
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

const UrlsTable = ({
  urls,
  onAddUrls,
  isAdding,
}: {
  urls: { url: string }[];
  onAddUrls: (urls: string[]) => void;
  isAdding?: boolean;
}) => {
  const columns: ColumnDef<{ url: string }>[] = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        enableHiding: false,
        header: () => <div>URL</div>,
        cell: ({ row }) => {
          return (
            <Link href={row.original.url} target="_blank">
              {row.original.url}
            </Link>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: urls,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col">
        <DataTable table={table} tableClassName="max-h-96" />
      </div>

      <div className="flex items-start justify-end gap-2">
        <Button
          disabled={table.getSelectedRowModel().rows.length === 0 || isAdding}
          onClick={() => {
            const urls = table.getSelectedRowModel().rows;
            onAddUrls(urls.map((url) => url.original.url));
          }}
        >
          {isAdding && (
            <Loader2Icon
              size={18}
              className="-ml-1 mr-2 h-4 w-4 animate-spin"
            />
          )}
          Add Links
        </Button>
      </div>
    </div>
  );
};
