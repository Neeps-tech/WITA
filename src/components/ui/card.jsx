import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <article className={cn("ui-card", className)} {...props} />;
}
