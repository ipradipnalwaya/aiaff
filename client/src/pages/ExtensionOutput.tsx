import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, FileText, Code2, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExtensionOutput() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{
    plainText: string;
    html: string;
    productName: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("plain");
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      setError("No session ID provided");
      setIsLoading(false);
      return;
    }

    fetch(`/api/extension-sessions/${sessionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Session not found");
        }
        return response.json();
      })
      .then((data) => {
        setSession({
          plainText: data.plainText,
          html: data.html,
          productName: data.productName,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load session");
        setIsLoading(false);
      });
  }, [location]);

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

  const downloadContent = (content: string, type: "txt" | "html" | "md") => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
      const filename = `generated-content-${timestamp}.${type}`;
      
      let mimeType = "text/plain";
      if (type === "html") mimeType = "text/html";
      else if (type === "md") mimeType = "text/markdown";
      
      const blob = new Blob([content], { type: mimeType });
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
        description: `File saved as ${filename}`,
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <Card className="p-6 min-h-96">
            <div className="flex flex-col items-center justify-center h-full min-h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <Card className="p-6 min-h-96">
            <div className="flex flex-col items-center justify-center h-full min-h-80 text-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {error || "Session not found"}
              </p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2.5xl font-semibold mb-2">Generated Content from Extension</h2>
          <p className="text-muted-foreground">
            Content generated for: <span className="font-medium text-foreground">{session.productName}</span>
          </p>
        </div>

        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
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
              
              <div className="flex flex-wrap gap-2">
                {activeTab === "plain" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(session.plainText, "plain")}
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
                      onClick={() => downloadContent(session.plainText, "txt")}
                      data-testid="button-download-txt"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      .txt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadContent(session.plainText, "md")}
                      data-testid="button-download-md"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      .md
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(session.html, "html")}
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
                      onClick={() => downloadContent(session.html, "html")}
                      data-testid="button-download-html"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      .html
                    </Button>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="plain" className="mt-0">
              <div className="rounded-md border bg-muted/30 p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" data-testid="text-plain-output">
                  {session.plainText}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="html" className="mt-0">
              <div className="rounded-md border bg-muted/30 p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm" data-testid="text-html-output">
                  {session.html}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
