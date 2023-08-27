import { ModalFn } from "@/types/modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useChatbot } from "@/providers/ChatbotProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
import { trpc } from "@/utils/trpc";
import { Loader, Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const AddLinksModal: ModalFn = ({ onOpenChage, open }) => {
  const { isLoaded, chatbot } = useChatbot();

  const { toast } = useToast();

  const addLinks = trpc.link.createMany.useMutation({
    onSuccess: (data) => {
      onOpenChage(false);
      toast({ title: `${data.length} links added` });
    },
    onError: (error) => {
      toast({
        title: "Failed to add links",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!(isLoaded && chatbot)) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChage}>
      <DialogContent className="flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Links</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="website">
          <TabsList>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          </TabsList>
          <TabsContent value="website">
            <LinksFromWebsite
              onAddUrls={(urls) => {
                addLinks.mutate({ chatbotId: chatbot.id, urls });
              }}
              isAdding={addLinks.isLoading}
            />
          </TabsContent>
          <TabsContent value="sitemap"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinksModal;

const linksFromWebsiteSchema = z.object({
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
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const form = useForm<z.infer<typeof linksFromWebsiteSchema>>({
    resolver: zodResolver(linksFromWebsiteSchema),
    defaultValues: {
      url: "",
    },
  });

  const fetchLinks = trpc.utils.getLinksFromWebsite.useMutation({
    onSuccess: (data) => {
      setUrls(data);
    },
  });

  const handleSubmit = (data: z.infer<typeof linksFromWebsiteSchema>) => {
    fetchLinks.mutate(data.url);
  };

  return (
    <>
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
          <Button type="submit" disabled={fetchLinks.isLoading || isAdding}>
            {fetchLinks.isLoading && (
              <Loader2 size={18} className="-ml-1 mr-2 h-4 w-4 animate-spin" />
            )}
            Fetch Urls
          </Button>
        </form>
      </Form>

      <div className="my-4">
        {urls.length > 0 ? (
          <div className="max-h-96 w-full max-w-full overflow-y-auto overflow-x-hidden rounded-lg border">
            <Table className="table-fixed overflow-hidden whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox
                      checked={selectedUrls.length === urls.length}
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedUrls(urls);
                        } else {
                          setSelectedUrls([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url}>
                    <TableCell className="w-8">
                      <Checkbox
                        checked={selectedUrls.includes(url)}
                        onCheckedChange={(value) => {
                          console.log({ value });
                          if (value) {
                            setSelectedUrls([
                              ...new Set([...selectedUrls, url]),
                            ]);
                          } else {
                            setSelectedUrls((urls) =>
                              urls.filter((u) => u !== url),
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <a href={url} target="_blank" className="truncate">
                        {url}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-sm text-muted-foreground">No result</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          disabled={selectedUrls.length === 0 || isAdding}
          onClick={() => onAddUrls(selectedUrls)}
        >
          {isAdding && (
            <Loader2 size={18} className="-ml-1 mr-2 h-4 w-4 animate-spin" />
          )}
          Add Links
        </Button>
      </DialogFooter>
    </>
  );
};
