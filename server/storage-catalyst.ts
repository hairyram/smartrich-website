// server/storage-catalyst.ts
// Complete Catalyst Data Store implementation for all IStorage methods

import type { Request } from 'express';
import catalyst from "zcatalyst-sdk-node";

// Types (matching your existing schema)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  createdAt: Date;
}

export interface InsertContactSubmission {
  name: string;
  email: string;
  phone: string;
  message?: string | null;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

// Catalyst request context type
type CatalystRequest = Record<string, unknown>;

// Helper to get Catalyst app from request
let currentRequest: CatalystRequest | null = null;

export function setCatalystRequest(req: Request) {
  // Cast Express Request to the type Catalyst expects
  currentRequest = req as unknown as CatalystRequest;
}

function getCatalystApp() {
  if (!currentRequest) {
    throw new Error('Catalyst request not set. Call setCatalystRequest(req) first.');
  }
  return catalyst.initialize(currentRequest);
}

export class CatalystStorage implements IStorage {
  
  // ============ USER METHODS ============
  
  async getUser(id: string): Promise<User | undefined> {
    try {
      const app = getCatalystApp();
      const datastore = app.datastore();
      const table = datastore.table('Users');
      
      const row = await table.getRow(parseInt(id));
      if (!row) return undefined;
      
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error('getUser error:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const app = getCatalystApp();
      const zcql = app.zcql();
      
      // Use ZCQL (Zoho's SQL-like query language) to search
      const query = `SELECT ROWID, username, password FROM Users WHERE username = '${username.replace(/'/g, "''")}'`;
      const result = await zcql.executeZCQLQuery(query);
      
      if (!result || result.length === 0) return undefined;
      
      const row = result[0].Users;
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error('getUserByUsername error:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const app = getCatalystApp();
    const datastore = app.datastore();
    const table = datastore.table('Users');
    
    const row = await table.insertRow({
      username: insertUser.username,
      password: insertUser.password
    });
    
    return {
      id: row.ROWID.toString(),
      username: row.username,
      password: row.password
    };
  }

  // ============ CONTACT SUBMISSION METHODS ============

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const app = getCatalystApp();
    const datastore = app.datastore();
    const table = datastore.table('ContactSubmissions');
    
    const now = new Date().toISOString();
    
    const row = await table.insertRow({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message || '',
      createdAt: now
    });
    
    return {
      id: parseInt(row.ROWID),
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message || null,
      createdAt: new Date(row.createdAt)
    };
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      const app = getCatalystApp();
      const zcql = app.zcql();
      
      const query = 'SELECT ROWID, name, email, phone, message, createdAt FROM ContactSubmissions ORDER BY createdAt DESC';
      const result = await zcql.executeZCQLQuery(query);
      
      if (!result || result.length === 0) return [];
      
      return result.map((item: any) => {
        const row = item.ContactSubmissions;
        return {
          id: parseInt(row.ROWID),
          name: row.name,
          email: row.email,
          phone: row.phone,
          message: row.message || null,
          createdAt: new Date(row.createdAt)
        };
      });
    } catch (error) {
      console.error('getContactSubmissions error:', error);
      return [];
    }
  }
}

export const storage = new CatalystStorage();