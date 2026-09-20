import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/impact-academia-logo.png"
      alt="Impact Academia"
      width={987}
      height={575}
      priority
      className={cn("h-auto w-[132px] object-contain", className)}
    />
  );
}
