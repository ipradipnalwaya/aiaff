import { z } from "zod";
import { pgTable, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const contentGenerationSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(10, "Product description must be at least 10 characters"),
  affiliateUrls: z.array(z.string().url("Must be a valid URL")).min(1, "At least one affiliate URL is required"),
  resourceType: z.enum(["text", "url"]),
  resourceText: z.string().optional(),
  resourceUrls: z.array(z.string().url("Must be a valid URL")).optional(),
  tone: z.enum(["professional", "casual", "enthusiastic", "informative"]),
  targetAudience: z.string().optional(),
  wordCount: z.enum(["800", "1000", "1500", "2000"]),
}).superRefine((data, ctx) => {
  if (data.resourceType === "text") {
    if (!data.resourceText || data.resourceText.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Resource content is required",
        path: ["resourceText"],
      });
    }
  } else {
    const hasValidUrls = data.resourceUrls && data.resourceUrls.some(url => url && url.trim().length > 0);
    if (!hasValidUrls) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one resource URL is required",
        path: ["resourceUrls"],
      });
    }
  }
});

export type ContentGenerationInput = z.infer<typeof contentGenerationSchema>;

export interface GeneratedContent {
  id: string;
  plainText: string;
  html: string;
  createdAt: string;
  productName: string;
  wordCount: number;
}

export const extensionSessions = pgTable("extension_sessions", {
  id: text("id").primaryKey(),
  productName: text("product_name").notNull(),
  plainText: text("plain_text").notNull(),
  html: text("html").notNull(),
  requestPayload: json("request_payload").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertExtensionSessionSchema = createInsertSchema(extensionSessions).omit({
  id: true,
  createdAt: true,
});

export type ExtensionSession = typeof extensionSessions.$inferSelect;
export type InsertExtensionSession = z.infer<typeof insertExtensionSessionSchema>;

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});
