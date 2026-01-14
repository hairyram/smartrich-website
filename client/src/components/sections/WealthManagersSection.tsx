import { Users, Sparkles, Blocks, ScanFace, TrendingUp, ArrowRight, LineChart, RefreshCw, MessageSquare, CheckCircle2, ArrowDown, PieChart, Target, Laptop, ShieldCheck, Settings2 } from "lucide-react";
import managerImg from "@assets/generated_images/professional_wealth_manager_dashboard_with_rupee.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  {
    id: 1,
    alert: {
      title: "Analytics Alert",
      desc: "Fixed Income thresholds breached. IPS violated.",
      icon: TrendingUp,
      color: "text-red-400",
      bg: "bg-red-500/20"
    },
    action: {
      title: "CRM Action",
      desc: "Auto-task: Generate report & call client for rebalancing.",
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-500/20"
    },
    remediation: {
      title: "Remediation",
      desc: "Minor portfolio shuffle in the most tax efficient manner.",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/20"
    }
  },
  {
    id: 2,
    alert: {
      title: "Business Opportunity",
      desc: "New 'Data Residency' law favors local Infrastructure.",
      icon: Sparkles,
      color: "text-amber-400",
      bg: "bg-amber-500/20"
    },
    action: {
      title: "CRM Action",
      desc: "Segment HNI clients >₹10Cr. Send opportunity note.",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/20"
    },
    remediation: {
      title: "Next Steps",
      desc: "Client approves via app. Allocating 5% to Infra AIF.",
      icon: RefreshCw,
      color: "text-green-400",
      bg: "bg-green-500/20"
    }
  }
];

export function WealthManagersSection() {
  const [activeExample, setActiveExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % EXAMPLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const example = EXAMPLES[activeExample];

  return (
    <section id="wealth-managers" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <div>
            <h2 className="text-secondary font-medium tracking-wide uppercase text-sm mb-4">For Wealth Managers & Distributors</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">
              The Integrated Wealth Stack
            </h3>
            <p className="text-xl text-secondary mb-8 font-medium">
              Future-Ready Wealth Management
            </p>
            
            <div className="space-y-8 mb-10">
              {/* WHY */}
              <div className="relative pl-8 border-l-2 border-white/10">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-secondary"></span>
                <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-xs opacity-70">The Problem</h4>
                <p className="text-primary-foreground/90 leading-relaxed text-lg">
                  You rely on manual processes, emails, and extensive paper trails. You struggle to create a portfolio report by amalgamating multiple spreadsheets. However, your tech-savvy clients are pushing for digital automation and AI.
                </p>
              </div>

              {/* WHAT */}
              <div className="relative pl-8 border-l-2 border-white/10">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent"></span>
                <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-xs opacity-70">The Solution</h4>
                <p className="text-primary-foreground/90 leading-relaxed mb-4">
                  Bring together an integrated set of tools that fits seamlessly into your ecosystem:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <PieChart className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Portfolio Management</strong>
                      <span className="text-xs text-white/70">Real-time tracking, performance analysis & auto-rebalancing.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Financial Planning</strong>
                      <span className="text-xs text-white/70">"What-if" scenarios, retirement goals & tax/estate planning.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">CRM Systems</strong>
                      <span className="text-xs text-white/70">Unified profiles, history & proactive engagement for personalized relationships.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Laptop className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Digital Client Portals</strong>
                      <span className="text-xs text-white/70">24/7 mobile access, summaries & secure communication.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Compliance & Reporting</strong>
                      <span className="text-xs text-white/70">Automated audit trails, checks & regulatory reports.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Back-office Automation</strong>
                      <span className="text-xs text-white/70">RPA for admin tasks like data entry & account opening.</span>
                    </div>
                  </div>
                   <div className="flex items-start gap-3">
                    <LineChart className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white text-sm">Data Aggregation & Analytics</strong>
                      <span className="text-xs text-white/70">Single comprehensive view with AI predictive insights.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOW */}
              <div className="relative pl-8 border-l-2 border-white/10">
                 <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white"></span>
                <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider text-xs opacity-70">The Benefit Engine</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
                    <p className="text-sm text-primary-foreground/90 leading-relaxed">
                      <strong className="text-white">Triggers:</strong> Smart monitors watch every portfolio, market movement, and regulation change 24/7.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                    <p className="text-sm text-primary-foreground/90 leading-relaxed">
                      <strong className="text-white">Insights:</strong> Data is instantly synthesized into clear opportunities—whether it's a tax-loss harvesting chance or a risk alert.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-white shrink-0" />
                    <p className="text-sm text-primary-foreground/90 leading-relaxed">
                      <strong className="text-white">Actions:</strong> Insights are converted into ready-to-execute tasks. One click to generate a report, send a proposal, or rebalance a portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-[#c9943a] text-[#1e3a5f] hover:bg-[#c9943a]/90 border-0 group w-full sm:w-auto font-semibold"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See The Integration
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Image Side */}
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-accent rounded-xl opacity-30 blur-lg" />
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 w-full aspect-[4/5] md:aspect-auto md:h-[680px]">
              <img 
                src={managerImg} 
                alt="Integrated Wealth Management Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent opacity-90"></div>
              
              {/* Animated Workflow Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                
                <div key={example.id} className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  
                  {/* Step 1: Alert */}
                  <div className="bg-card/20 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-start gap-4">
                    <div className={cn("p-2 rounded-full shrink-0", example.alert.bg, example.alert.color)}>
                      <example.alert.icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 uppercase font-bold tracking-wider mb-1">{example.alert.title}</div>
                      <div className="text-white text-sm font-medium leading-snug">{example.alert.desc}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center h-6">
                     <ArrowDown className="text-white/20 h-full w-5" />
                  </div>

                  {/* Step 2: CRM Action */}
                  <div className="bg-card/20 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-start gap-4">
                    <div className={cn("p-2 rounded-full shrink-0", example.action.bg, example.action.color)}>
                      <example.action.icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 uppercase font-bold tracking-wider mb-1">{example.action.title}</div>
                      <div className="text-white text-sm font-medium leading-snug">{example.action.desc}</div>
                    </div>
                  </div>

                  <div className="flex justify-center h-6">
                     <ArrowDown className="text-white/20 h-full w-5" />
                  </div>

                   {/* Step 3: Remediation */}
                   <div className="bg-card/20 backdrop-blur-md border border-white/10 p-4 rounded-lg flex items-start gap-4 border-l-4 border-l-green-500">
                    <div className={cn("p-2 rounded-full shrink-0", example.remediation.bg, example.remediation.color)}>
                      <example.remediation.icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 uppercase font-bold tracking-wider mb-1">{example.remediation.title}</div>
                      <div className="text-white text-sm font-medium leading-snug">{example.remediation.desc}</div>
                    </div>
                  </div>

                </div>
                
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {EXAMPLES.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveExample(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300", 
                        activeExample === idx ? "w-8 bg-secondary" : "w-2 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
