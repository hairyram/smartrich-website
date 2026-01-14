import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

const contactFormSchema = insertContactSubmissionSchema.extend({
  recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),
});

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set - skipping verification");
    return true;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json() as { success: boolean; score?: number };
    
    // For reCAPTCHA v3, check score (0.0 - 1.0, higher is more likely human)
    // Score of 0.5 is a reasonable threshold
    return data.success && (data.score === undefined || data.score >= 0.5);
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = contactFormSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid form data", 
          details: parsed.error.flatten() 
        });
      }

      const { recaptchaToken, ...submissionData } = parsed.data;

      // Verify reCAPTCHA
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(403).json({ error: "reCAPTCHA verification failed" });
      }

      // Store submission
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

  return httpServer;
}
