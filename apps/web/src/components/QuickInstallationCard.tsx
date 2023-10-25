import { APP_NAME, BASE_DOMAIN } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Check, Copy } from "lucide-react";

const QuickInstallationCard = ({ chatbotId }: { chatbotId: string }) => {
  const [copied, setCopied] = useState(false);
  const scriptCode = `<!-- ${APP_NAME} -->\n<script async src="${BASE_DOMAIN}/widgets/chatbox.js?id=${chatbotId}"></script>`;

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Installation</CardTitle>
        <CardDescription>{`Copy and paste the script below into the <head> element of every page. Enjoy enhanced customer interactions!`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="codeblock">
          <pre className="bg-muted overflow-auto whitespace-pre-wrap rounded-md p-4">
            <code>{scriptCode}</code>
          </pre>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} variant="outline" disabled={copied}>
          <span className="-ml-1 mr-2">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </span>
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickInstallationCard;
