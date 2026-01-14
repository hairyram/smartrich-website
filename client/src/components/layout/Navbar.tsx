import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/">
          <a className="hover:opacity-90 transition-opacity">
            <Logo />
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#wealth-managers" className="text-sm font-medium hover:text-secondary transition-colors text-[#1e3a5f]">For Wealth Managers</a>
          <a href="#families" className="text-sm font-medium hover:text-secondary transition-colors text-[#1e3a5f]">For Families</a>
          <Button 
            variant="default" 
            className="bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90"
            onClick={scrollToContact}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6 text-[#1e3a5f]" /> : <Menu className="h-6 w-6 text-[#1e3a5f]" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          <a href="#wealth-managers" className="text-sm font-medium py-2 text-[#1e3a5f]" onClick={() => setIsOpen(false)}>For Wealth Managers</a>
          <a href="#families" className="text-sm font-medium py-2 text-[#1e3a5f]" onClick={() => setIsOpen(false)}>For Families</a>
          <Button className="w-full bg-[#1e3a5f] text-white" onClick={() => { scrollToContact(); setIsOpen(false); }}>Get Started</Button>
        </div>
      )}
    </nav>
  );
}
