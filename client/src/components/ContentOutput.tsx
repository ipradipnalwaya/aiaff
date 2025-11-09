import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, FileText, Code2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentOutputProps {
  plainText: string;
  html: string;
  isGenerating: boolean;
}

export function ContentOutput({ plainText, html, isGenerating }: ContentOutputProps) {
  const [activeTab, setActiveTab] = useState("plain");
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: "plain" | "html") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "plain") {
        setCopiedPlain(true);
        setTimeout(() => setCopiedPlain(false), 2000);
      } else {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === "plain" ? "Plain text" : "HTML code"} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const downloadContent = (content: string, type: "txt" | "html") => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
      const filename = `generated-content-${timestamp}.${type}`;
      
      const blob = new Blob([content], { type: type === "txt" ? "text/plain" : "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: `${type === "txt" ? "Plain text" : "HTML"} file saved as ${filename}`,
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isGenerating) {
    return (
      <Card className="p-6 min-h-96">
        <div className="flex flex-col items-center justify-center h-full min-h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Generating content...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      </Card>
    );
  }

  if (!plainText && !html) {
    return (
      <Card className="p-6 min-h-96">
        <div className="flex flex-col items-center justify-center h-full min-h-80 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Fill out the form on the left and click "Generate Content" to create your SEO-optimized blog post
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="plain" data-testid="tab-plain-text">
              <FileText className="mr-2 h-4 w-4" />
              Plain Text
            </TabsTrigger>
            <TabsTrigger value="html" data-testid="tab-html">
              <Code2 className="mr-2 h-4 w-4" />
              HTML Code
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === "plain" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(plainText, "plain")}
                  data-testid="button-copy-plain"
                >
                  {copiedPlain ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedPlain ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadContent(plainText, "txt")}
                  data-testid="button-download-plain"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download .txt
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(html, "html")}
                  data-testid="button-copy-html"
                >
                  {copiedHtml ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedHtml ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadContent(html, "html")}
                  data-testid="button-download-html"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download .html
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="plain" className="mt-0">
          <div className="rounded-md border bg-muted/30 p-6 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" data-testid="text-plain-output">
              {plainText}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="html" className="mt-0">
          <div className="rounded-md border bg-muted/30 p-6 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm" data-testid="text-html-output">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
