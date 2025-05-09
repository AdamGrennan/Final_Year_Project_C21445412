"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => {
  const [sliderValue, setSliderValue] = React.useState([0]);
  
  const sliderColor =
    sliderValue[0] < 33 ? "bg-red-500" :
    sliderValue[0] < 66 ? "bg-yellow-500" : 
    "bg-green-500";

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={sliderValue}
      onValueChange={(value) => setSliderValue(value)}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
      >
        <SliderPrimitive.Range className={cn("absolute h-full", sliderColor)} />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full border border-primary/50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          sliderColor
        )}
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
