import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <hr
      className={cn("my-4 border-t border-gray-300", className)}
      ref={ref}
      {...props}
    />
  )
);
Separator.displayName = "Separator";
