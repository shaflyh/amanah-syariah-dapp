import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ icon: Icon, title, description, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-8 shadow-lg bg-gradient-to-r from-primary to-secondary",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground">{title}</h1>
        </div>
        <p className="text-lg text-primary-foreground/90">{description}</p>
      </div>
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/10 rounded-full"></div>
    </div>
  );
}
