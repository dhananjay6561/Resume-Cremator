import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className = '', variant = "default", ...props }: BadgeProps) {
  let variantClasses = "bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/80";
  
  if (variant === "secondary") {
    variantClasses = "bg-[#FAFAF9] text-[#1A1A1A] border border-[#E5E5E5]";
  } else if (variant === "destructive") {
    variantClasses = "bg-[#E5451F] text-white";
  } else if (variant === "outline") {
    variantClasses = "text-[#1A1A1A] border border-[#E5E5E5]";
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] ${variantClasses} ${className}`}
      {...props}
    />
  )
}

export { Badge }
