import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/impactfools-icon.png"
      alt=""
      width={1536}
      height={1536}
      priority
      className={cn("h-auto w-12 object-contain", className)}
    />
  );
}
