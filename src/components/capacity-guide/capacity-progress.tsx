import { CAPACITY_STEPS } from "@/lib/capacity-guide/data";
import { cn } from "@/lib/utils";

export function CapacityProgress({ currentStep }: { currentStep: number }) {
  return (
    <div aria-label={`Step ${currentStep + 1} of ${CAPACITY_STEPS.length}`}>
      <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
        <span>{String(currentStep + 1).padStart(2, "0")} {CAPACITY_STEPS[currentStep]}</span>
        <span>{currentStep + 1}/{CAPACITY_STEPS.length}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
        {CAPACITY_STEPS.map((step, index) => (
          <span key={step} className={cn("h-1.5 rounded-full transition-colors", index <= currentStep ? "bg-blue" : "bg-line")} />
        ))}
      </div>
    </div>
  );
}
