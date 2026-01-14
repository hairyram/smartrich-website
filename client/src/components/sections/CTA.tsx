import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

export function CTA() {
  const { toast } = useToast();
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setRecaptchaLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY || !recaptchaLoaded) {
      return "no-recaptcha-configured";
    }
    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact_form" });
  }, [recaptchaLoaded]);

  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const recaptchaToken = await getRecaptchaToken();
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit form");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Received",
        description: data.message || "We'll get back to you shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(values);
  }

  return (
    <section id="contact-form" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e3a5f] mb-6">
              Ready to Transform Your <br/> Wealth Management?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join leading families and wealth managers who trust SmartRich for their financial intelligence.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-border/50 max-w-2xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#1e3a5f]">Full Name</Label>
                        <FormControl>
                          <Input 
                            placeholder="Aditya Sharma" 
                            data-testid="input-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#1e3a5f]">Phone Number</Label>
                        <FormControl>
                          <Input 
                            placeholder="+91 98765 43210" 
                            data-testid="input-phone"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[#1e3a5f]">Email Address</Label>
                      <FormControl>
                        <Input 
                          placeholder="aditya.sharma@example.com" 
                          data-testid="input-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[#1e3a5f]">Message (Optional)</Label>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your requirements..." 
                          className="min-h-[100px]" 
                          data-testid="input-message"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90 h-12 text-lg"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? "Submitting..." : "Get Started Now"}
                </Button>
                
                {RECAPTCHA_SITE_KEY && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{" "}
                    apply.
                  </p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
