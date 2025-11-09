import { type User, type InsertUser, type ExtensionSession, type InsertExtensionSession, users, extensionSessions } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createExtensionSession(session: InsertExtensionSession): Promise<ExtensionSession>;
  getExtensionSession(id: string): Promise<ExtensionSession | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    await db.insert(users).values(user);
    return user;
  }

  async createExtensionSession(sessionData: InsertExtensionSession): Promise<ExtensionSession> {
    const id = randomUUID();
    const session: ExtensionSession = {
      ...sessionData,
      id,
      createdAt: new Date(),
    };
    await db.insert(extensionSessions).values(session);
    return session;
  }

  async getExtensionSession(id: string): Promise<ExtensionSession | undefined> {
    const result = await db.select().from(extensionSessions).where(eq(extensionSessions.id, id)).limit(1);
    return result[0];
  }
}

export const storage = new DbStorage();
