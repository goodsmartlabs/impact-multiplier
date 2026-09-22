import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/impactfools-icon.png"
      alt=""
      width={512}
      height={512}
      priority
      className={cn("aspect-square h-12 w-12 shrink-0 object-contain", className)}
    />
  );
}
