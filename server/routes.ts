import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { createChallenge, verifySolution } from "altcha-lib";
import crypto from "crypto";

if (typeof globalThis.crypto === "undefined") {
  (globalThis as any).crypto = crypto;
}

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().optional(),
  altcha: z.string().min(1, "ALTCHA verification required"),
});

const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || "smartrich-altcha-secret-key-2024";

// In-memory storage for contact submissions (works on all platforms)
const contactSubmissions: Array<{
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  createdAt: Date;
}> = [];
let nextId = 1;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/altcha/challenge", async (_req, res) => {
    try {
      const challenge = await createChallenge({
        hmacKey: ALTCHA_HMAC_KEY,
        maxNumber: 50000,
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });
      res.json(challenge);
    } catch (error) {
      console.error("ALTCHA challenge error:", error);
      res.status(500).json({ error: "Failed to generate challenge" });
    }
  });

  app.post("/api/contact", async (req, res) => {
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

      // Store submission in memory and log it
      const submission = {
        id: nextId++,
        name: submissionData.name,
        email: submissionData.email,
        phone: submissionData.phone,
        message: submissionData.message || null,
        createdAt: new Date(),
      };
      contactSubmissions.push(submission);
      
      // Log for record keeping
      console.log("New contact submission:", JSON.stringify(submission));
      
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

  return httpServer;
}
