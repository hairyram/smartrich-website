import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import heroBg from "@/assets/abstract_financial_growth_background.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40 z-10" />
        <img 
          src={heroBg} 
          alt="Financial Growth Background" 
          className="w-full h-full object-cover object-center opacity-80"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Next Generation Wealth Technology
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Wealth Intelligence, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Simplified.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            A unified platform for Families and Wealth Managers to track assets, analyze risks, and optimize performance across every asset class.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 bg-[#c9943a] text-[#1e3a5f] hover:bg-[#c9943a]/90 shadow-lg shadow-[#c9943a]/20 font-semibold"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 h-14 border-[#1e3a5f]/20 text-[#1e3a5f] hover:bg-[#1e3a5f]/5"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
