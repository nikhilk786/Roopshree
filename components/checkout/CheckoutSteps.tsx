import { ArrowLeft } from "lucide-react"

export function CheckoutSteps({ activeStep }: { activeStep: 1 | 2 }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-[#C39150] sm:gap-3 sm:text-[10px] sm:tracking-[0.1em]">
      <Step index={1} label="Contact Details" active={activeStep === 1} />
      <span className="h-px w-4 bg-[#C39150]/40 sm:w-5" />
      <Step index={2} label="Review" active={activeStep === 2} />
    </div>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Back to shipping details"
      onClick={onClick}
      className="text-[#3F2617] transition hover:text-[#C39150]"
    >
      <ArrowLeft className="size-4" />
    </button>
  )
}

function Step({
  index,
  label,
  active,
}: {
  index: number
  label: string
  active: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex size-5 items-center justify-center rounded-[2px] text-[10px] ${
          active
            ? "bg-[#C39150] text-white"
            : "border border-[#C39150] text-[#C39150]"
        }`}
      >
        {index}
      </span>
      <span>{label}</span>
    </div>
  )
}
