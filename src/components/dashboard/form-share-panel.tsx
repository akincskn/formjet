"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateEmbedSnippet, generateFormUrl, generateApiEndpoint } from "@/lib/embed-generator";

interface FormSharePanelProps {
  slug: string;
}

export function FormSharePanel({ slug }: FormSharePanelProps) {
  const formUrl = generateFormUrl(slug);
  const embedCode = generateEmbedSnippet(slug);
  const apiEndpoint = generateApiEndpoint(slug);

  return (
    <div className="space-y-4">
      <ShareRow label="Form URL" value={formUrl} isLink href={formUrl} />
      <ShareRow label="API Endpoint" value={apiEndpoint} />
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">EMBED CODE</p>
        <div className="relative">
          <pre className="rounded-md border bg-muted p-3 text-xs overflow-auto">{embedCode}</pre>
          <CopyButton value={embedCode} className="absolute right-2 top-2" />
        </div>
      </div>
    </div>
  );
}

function ShareRow({
  label,
  value,
  isLink,
  href,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label.toUpperCase()}</p>
      <div className="flex gap-2">
        <Input value={value} readOnly className="font-mono text-xs" />
        <CopyButton value={value} />
        {isLink && href && (
          <Button size="icon" variant="outline" asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleCopy}
      className={className}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
