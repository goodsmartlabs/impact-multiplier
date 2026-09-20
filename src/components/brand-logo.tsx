import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/craftfool-academia-logo.jpg"
      alt="CraftFool Academia"
      width={1080}
      height={1080}
      priority
      className={cn("h-auto w-[72px] object-contain", className)}
    />
  );
}
