"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    if (copied) return;
    window.navigator.clipboard.writeText(text);
    setCopied(true);
  }, [copied, text]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <Button
      disabled={copied}
      variant="ghost"
      size="icon"
      onClick={onCopy}
      className="-my-2 h-8 w-8"
    >
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
    </Button>
  );
};

export default CopyButton;
