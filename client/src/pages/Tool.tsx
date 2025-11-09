import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductInputForm } from "@/components/ProductInputForm";
import { ContentOutput } from "@/components/ContentOutput";
import type { ContentGenerationInput } from "@shared/schema";

export default function Tool() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    plainText: "",
    html: "",
  });

  const handleGenerate = async (data: ContentGenerationInput) => {
    setIsGenerating(true);
    console.log("Generating content with data:", data);
    
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate content");
      }
      
      const result = await response.json();
      
      setGeneratedContent({
        plainText: result.plainText,
        html: result.html,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent({
        plainText: `Error: ${error instanceof Error ? error.message : "Failed to generate content"}`,
        html: "",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2.5xl font-semibold mb-2">Create SEO-Optimized Content</h2>
          <p className="text-muted-foreground">
            Transform product data into compelling, profit-driving blog content effortlessly. Generate SEO-optimized affiliate articles that convert readers into customers.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-4">Product Information</h3>
            <ProductInputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Generated Content</h3>
            <ContentOutput
              plainText={generatedContent.plainText}
              html={generatedContent.html}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
