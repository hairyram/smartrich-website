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
import { useRef } from "react";
import "altcha";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export function CTA() {
  const { toast } = useToast();
  const altchaRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const altchaInput = altchaRef.current?.querySelector('input[name="altcha"]') as HTMLInputElement | null;
      const altchaPayload = altchaInput?.value || "";
      
      if (!altchaPayload) {
        throw new Error("Please complete the verification");
      }
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, altcha: altchaPayload }),
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

                <div ref={altchaRef} className="flex justify-center">
                  <altcha-widget
                    challengeurl="/api/altcha/challenge"
                    hidefooter
                    data-testid="altcha-widget"
                  ></altcha-widget>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90 h-12 text-lg"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? "Submitting..." : "Get Started Now"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
