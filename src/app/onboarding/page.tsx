// onboarding/page.tsx or onboarding/index.tsx

"use client"

import { Suspense } from "react"
import OnboardingPageInner from "./OnboardingInnerPage"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <OnboardingPageInner />
    </Suspense>
  )
}
