"use client"

import { Suspense } from "react"
import OnboardingPageInner from "./OnboardInnerPages"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <OnboardingPageInner />
    </Suspense>
  )
}
