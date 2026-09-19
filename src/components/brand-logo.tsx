import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/impact-academia-logo.png"
      alt="100impact academia"
      width={1060}
      height={638}
      priority
      className={cn("h-auto w-[132px] object-contain", className)}
    />
  );
}
