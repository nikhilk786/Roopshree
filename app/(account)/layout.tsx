import Header from "@/components/common/Header"
import { getCurrentSession } from "@/lib/auth"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession()

  return (
    <>
      <Header isAuthenticated={Boolean(session)} />
      {children}
    </>
  )
}
