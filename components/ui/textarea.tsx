import * as React from "react";

import  cn  from "@/lib/utils/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
         "flex min-h-20 resize-none w-full rounded-md border border-input bg-background px-3 py-2 text-sm  placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
