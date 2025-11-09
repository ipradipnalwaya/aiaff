import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAffiliateContent } from "./gemini";
import { scrapeMultipleUrls } from "./scraper";
import { z } from "zod";

const generateContentSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(1, "Product description is required"),
  affiliateUrls: z.array(z.string().url("Invalid affiliate URL")).min(1, "At least one affiliate URL is required"),
  resourceType: z.enum(["text", "url"]),
  resourceText: z.string().optional(),
  resourceUrls: z.array(z.string().url("Invalid resource URL")).optional(),
  tone: z.string().min(1, "Tone is required"),
  targetAudience: z.string().optional(),
  wordCount: z.string(),
}).refine(
  (data) => {
    if (data.resourceType === "text") {
      return !!data.resourceText && data.resourceText.trim().length > 0;
    }
    return !!data.resourceUrls && data.resourceUrls.length > 0;
  },
  {
    message: "Resource content is required: either text or URLs must be provided",
    path: ["resourceType"],
  }
);

export async function registerRoutes(app: Express): Promise<Server> {
  // Content generation endpoint
  app.post("/api/generate-content", async (req, res) => {
    try {
      const data = generateContentSchema.parse(req.body);
      
      // Get resource content based on type
      let resourceContent = "";
      if (data.resourceType === "text") {
        resourceContent = data.resourceText || "";
      } else {
        // Scrape URLs
        const urls = data.resourceUrls || [];
        if (urls.length === 0) {
          return res.status(400).json({ error: "No resource URLs provided" });
        }
        
        try {
          resourceContent = await scrapeMultipleUrls(urls);
        } catch (error) {
          console.error("URL scraping error:", error);
          return res.status(500).json({ 
            error: "Failed to scrape URLs. Please check that the URLs are accessible and try again." 
          });
        }
      }
      
      // Generate content using Gemini
      const result = await generateAffiliateContent({
        productName: data.productName,
        productDescription: data.productDescription,
        affiliateUrls: data.affiliateUrls,
        resourceContent,
        tone: data.tone,
        targetAudience: data.targetAudience,
        wordCount: data.wordCount,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Content generation error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate content" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
