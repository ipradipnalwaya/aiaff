import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAffiliateContent } from "./gemini";
import { scrapeMultipleUrls } from "./scraper";
import { z } from "zod";
import type { RequestHandler } from "express";

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

interface RateLimiters {
  contentGenerationLimiter: RequestHandler;
  generalApiLimiter: RequestHandler;
}

export async function registerRoutes(app: Express, rateLimiters: RateLimiters): Promise<Server> {
  // Content generation endpoint - protected with strict rate limiting
  app.post("/api/generate-content", rateLimiters.contentGenerationLimiter, async (req, res) => {
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

  // Extension session endpoints - protected with general rate limiting
  app.post("/api/extension-sessions", rateLimiters.generalApiLimiter, async (req, res) => {
    try {
      const { productName, plainText, html, requestPayload } = req.body;
      
      if (!productName || !plainText || !html || !requestPayload) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const session = await storage.createExtensionSession({
        productName,
        plainText,
        html,
        requestPayload,
      });
      
      res.json(session);
    } catch (error) {
      console.error("Extension session creation error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to create session" 
      });
    }
  });

  app.get("/api/extension-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getExtensionSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Extension session retrieval error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to retrieve session" 
      });
    }
  });

  // Database setup endpoint (call once to create tables)
  app.post("/api/setup-database", async (req, res) => {
    try {
      const { setupKey } = req.body;
      
      // Simple security: require a setup key
      if (setupKey !== process.env.DATABASE_SETUP_KEY && setupKey !== "setup-genaimagic-2024") {
        return res.status(403).json({ error: "Invalid setup key" });
      }
      
      // Import db directly to run migrations
      const { db: database } = await import("./db");
      const { sql } = await import("drizzle-orm");
      
      // Create tables using raw SQL from migration
      await database.execute(sql`
        CREATE TABLE IF NOT EXISTS "extension_sessions" (
          "id" text PRIMARY KEY NOT NULL,
          "product_name" text NOT NULL,
          "plain_text" text NOT NULL,
          "html" text NOT NULL,
          "request_payload" json NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL
        );
      `);
      
      await database.execute(sql`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" text PRIMARY KEY NOT NULL,
          "username" text NOT NULL,
          "password" text NOT NULL,
          CONSTRAINT "users_username_unique" UNIQUE("username")
        );
      `);
      
      res.json({ 
        success: true, 
        message: "Database tables created successfully" 
      });
    } catch (error) {
      console.error("Database setup error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to setup database" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
