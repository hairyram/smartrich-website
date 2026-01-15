import { PieChart, Lock, FileText, Globe, Calculator, ArrowRight, ShieldCheck, Database, Landmark, ScrollText } from "lucide-react";
import familyImg from "@/assets/family_office_dashboard_with_rupee.png";
import { Button } from "@/components/ui/button";

export function FamiliesSection() {
  return (
    <section id="families" className="py-24 bg-background text-foreground relative overflow-hidden border-t border-border/40">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative h-full flex items-center justify-center order-2 md:order-1">
            <div className="absolute -inset-1 bg-gradient-to-l from-secondary/20 to-primary/10 rounded-xl opacity-30 blur-lg" />
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 w-full aspect-[4/5] md:aspect-auto md:h-[680px]">
              <img 
                src={familyImg} 
                alt="Family Office Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 md:order-2">
            <h2 className="text-secondary font-medium tracking-wide uppercase text-sm mb-4">For Families & Family Offices</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[#1e3a5f]">
              Preserve & Grow <br/>Generational Wealth
            </h3>
            <p className="text-xl text-muted-foreground mb-8 font-medium">
              Privacy, Control, and Total Visibility.
            </p>
            
            <div className="space-y-8 mb-10">
              {/* THE FOCUS */}
              <div className="relative pl-8 border-l-2 border-primary/10">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#1e3a5f]"></span>
                <h4 className="text-lg font-bold text-[#1e3a5f] mb-2 uppercase tracking-wider text-xs opacity-70">The Focus</h4>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  For high-net-worth and ultra-high-net-worth families, the priority is privacy, control, and managing complex, multi-generational assets across jurisdictions and entities.
                </p>
              </div>

              {/* THE CAPABILITIES */}
              <div className="relative pl-8 border-l-2 border-primary/10">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-secondary"></span>
                <h4 className="text-lg font-bold text-[#1e3a5f] mb-2 uppercase tracking-wider text-xs opacity-70">The Capabilities</h4>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  A unified ecosystem designed for complexity:
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <PieChart className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1e3a5f] text-sm">Consolidated Reporting</strong>
                      <span className="text-xs text-muted-foreground">Unified view of custodians, banks, and alternative assets (Real Estate, PE) to monitor total net worth.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1e3a5f] text-sm">Private Investment Management</strong>
                      <span className="text-xs text-muted-foreground">Integration with platforms for tracking deal flows, illiquid assets, and co-investment opportunities.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1e3a5f] text-sm">Secure Document Vault</strong>
                      <span className="text-xs text-muted-foreground">Encrypted storage for sensitive legal docs (wills, trusts) and confidential communication channels.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Landmark className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1e3a5f] text-sm">Accounting Integration</strong>
                      <span className="text-xs text-muted-foreground">Connects with GL systems for complex multi-entity structures and trust accounting.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ScrollText className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1e3a5f] text-sm">Specialized Planning</strong>
                      <span className="text-xs text-muted-foreground">Integrations for estate planning, cross-border tax optimization, and succession modeling.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90 shadow-lg shadow-[#1e3a5f]/20 font-semibold w-full sm:w-auto"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
