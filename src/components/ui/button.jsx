import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  return (
    <button
      className={cn(
        "ui-button",
        variant === "ghost" && "is-ghost",
        variant === "dark" && "is-dark",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
