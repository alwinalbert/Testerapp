"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Custom styled radio option for MCQ questions
interface RadioOptionProps {
  value: string;
  label: string;
  selected?: boolean;
  className?: string;
}

const RadioOption = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioOptionProps & Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "value">
>(({ value, label, selected, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        )}
      >
        {selected && <Circle className="h-2.5 w-2.5 fill-white text-white" />}
      </div>
      <span className="flex-1 text-sm">{label}</span>
    </RadioGroupPrimitive.Item>
  );
});
RadioOption.displayName = "RadioOption";

export { RadioGroup, RadioGroupItem, RadioOption };
