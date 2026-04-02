import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        {
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200": variant === "default",
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200": variant === "success",
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200": variant === "warning",
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200": variant === "danger",
          "border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200": variant === "info",
          "border-slate-200 bg-transparent text-slate-800 hover:bg-slate-100": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
