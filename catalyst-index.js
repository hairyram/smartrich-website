// catalyst-index.ts
import express from "express";
import { createServer } from "http";

// server/storage-catalyst.ts
import catalyst from "zcatalyst-sdk-node";
var currentRequest = null;
function getCatalystApp() {
  if (!currentRequest) {
    throw new Error("Catalyst request not set. Call setCatalystRequest(req) first.");
  }
  return catalyst.initialize(currentRequest);
}
var CatalystStorage = class {
  // ============ USER METHODS ============
  async getUser(id) {
    try {
      const app2 = getCatalystApp();
      const datastore = app2.datastore();
      const table = datastore.table("Users");
      const row = await table.getRow(parseInt(id));
      if (!row) return void 0;
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error("getUser error:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const app2 = getCatalystApp();
      const zcql = app2.zcql();
      const query = `SELECT ROWID, username, password FROM Users WHERE username = '${username.replace(/'/g, "''")}'`;
      const result = await zcql.executeZCQLQuery(query);
      if (!result || result.length === 0) return void 0;
      const row = result[0].Users;
      return {
        id: row.ROWID.toString(),
        username: row.username,
        password: row.password
      };
    } catch (error) {
      console.error("getUserByUsername error:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    const app2 = getCatalystApp();
    const datastore = app2.datastore();
    const table = datastore.table("Users");
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
  async createContactSubmission(submission) {
    const app2 = getCatalystApp();
    const datastore = app2.datastore();
    const table = datastore.table("ContactSubmissions");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const row = await table.insertRow({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message || "",
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
  async getContactSubmissions() {
    try {
      const app2 = getCatalystApp();
      const zcql = app2.zcql();
      const query = "SELECT ROWID, name, email, phone, message, createdAt FROM ContactSubmissions ORDER BY createdAt DESC";
      const result = await zcql.executeZCQLQuery(query);
      if (!result || result.length === 0) return [];
      return result.map((item) => {
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
      console.error("getContactSubmissions error:", error);
      return [];
    }
  }
};
var storage = new CatalystStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
import { createChallenge, verifySolution } from "altcha-lib";
import crypto from "crypto";
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = crypto;
}
var contactFormSchema = insertContactSubmissionSchema.extend({
  altcha: z.string().min(1, "ALTCHA verification required")
});
var ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || "this-random-altcha-secret-key-2024";
async function registerRoutes(httpServer2, app2) {
  app2.get("/api/altcha/challenge", async (_req, res) => {
    try {
      const challenge = await createChallenge({
        hmacKey: ALTCHA_HMAC_KEY,
        maxNumber: 5e4,
        expires: new Date(Date.now() + 10 * 60 * 1e3)
      });
      res.json(challenge);
    } catch (error) {
      console.error("ALTCHA challenge error:", error);
      res.status(500).json({ error: "Failed to generate challenge" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const parsed = contactFormSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid form data",
          details: parsed.error.flatten()
        });
      }
      const { altcha, ...submissionData } = parsed.data;
      const isValid = await verifySolution(altcha, ALTCHA_HMAC_KEY, true);
      if (!isValid) {
        return res.status(403).json({ error: "ALTCHA verification failed" });
      }
      const submission = await storage.createContactSubmission(submissionData);
      return res.status(201).json({
        success: true,
        message: "Thank you for your enquiry. We will get back to you shortly.",
        id: submission.id
      });
    } catch (error) {
      console.error("Contact form error:", error);
      return res.status(500).json({ error: "Failed to process your request" });
    }
  });
  return httpServer2;
}

// catalyst-index.ts
var app = express();
var PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 5e3;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist/public"));
var httpServer = createServer(app);
registerRoutes(httpServer, app).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
