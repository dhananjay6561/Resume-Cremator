import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'fire';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-heading font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5451F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.97]";

    const sizes: Record<string, string> = {
      sm:  "h-8  px-4 text-xs",
      md:  "h-10 px-6 text-sm",
      lg:  "h-12 px-8 text-base",
    };

    const variants: Record<string, string> = {
      default: "bg-[#E5451F] text-white hover:bg-[#c93a18] shadow-lg shadow-[#E5451F]/20 hover:shadow-[#E5451F]/40",
      fire:    "bg-gradient-to-r from-[#E5451F] to-[#F97316] text-white hover:from-[#c93a18] hover:to-[#e06210] shadow-lg shadow-[#E5451F]/25 hover:shadow-[#E5451F]/50",
      outline: "bg-transparent border border-[#334155] text-[#F8FAFC] hover:bg-[#1E293B] hover:border-[#475569]",
      ghost:   "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
