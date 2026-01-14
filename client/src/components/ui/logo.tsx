import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <div className={cn("relative inline-flex items-center select-none", className)}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
          .font-logo { font-family: 'Playfair Display', serif; }
        `}
      </style>
      <div className="font-logo font-black text-3xl tracking-wider">
        <span className={cn(
          variant === "light" ? "text-white" : "text-[#1e3a5f]"
        )}>
          SMART
        </span>
        <span className="text-[#c9943a] relative">
          R
          <span className="relative inline-block mx-[0.5px]">
            <span 
              className="absolute left-1/2 -translate-x-1/2 -top-[8px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#c9943a]"
            />
            I
          </span>
          CH
        </span>
      </div>
    </div>
  );
}
