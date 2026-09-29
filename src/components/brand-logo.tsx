import Image from "next/image";
import { cn } from "@/lib/utils";

/** The ImpactFools mascot: pink brow, glossy eyes and tongue. */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/impactfools-mascot.png"
      alt=""
      width={412}
      height={512}
      priority={priority}
      className={cn("h-12 w-auto shrink-0 object-contain", className)}
    />
  );
}

/**
 * "ImpactFools." set live in Fredoka, coloured like the logo:
 * pink Impact, blue Fools, pink full stop.
 */
export function BrandWordmark({ className, academia = false }: { className?: string; academia?: boolean }) {
  return (
    <span className={cn("im-wordmark inline-flex flex-col items-stretch", className)}>
      <span className="whitespace-nowrap">
        <span className="text-pink">Impact</span>
        <span className="text-blue">Fools</span>
        <span className="text-pink">.</span>
      </span>
      {academia && (
        <span className="mt-[0.18em] flex justify-between pl-[0.1em] pr-[0.35em] font-sans text-[0.3em] font-semibold uppercase leading-none tracking-normal text-blue" aria-hidden="true">
          {"Academia".split("").map((letter, index) => <span key={index}>{letter}</span>)}
        </span>
      )}
    </span>
  );
}
