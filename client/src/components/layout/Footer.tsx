import { Logo } from "@/components/ui/logo";

export function Footer() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1e3a5f] text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="inline-block">
              <Logo variant="light" />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Empowering families and wealth managers with comprehensive financial intelligence and unified portfolio management.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-[#c9943a]">Platform</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#wealth-managers" className="hover:text-white transition-colors">For Wealth Managers</a></li>
              <li><a href="#families" className="hover:text-white transition-colors">For Families</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-[#c9943a]">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" onClick={scrollToContact} className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-[#c9943a]">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>contact@thesmartrich.com</li>
              <li>+91-98765-42310</li>
              <li>Unispace Tech Park,<br/>Kadubeesanahalli,<br/>Bangalore - 560102</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} SmartRich Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
