import { redirect } from "next/navigation"

import { CheckoutPage } from "@/components/checkout/CheckoutPage"
import { getCurrentSession } from "@/lib/auth"

export default async function Page() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth?callbackUrl=/checkout")
  }

  return <CheckoutPage />
}
