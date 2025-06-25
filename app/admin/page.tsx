import { AdminDashboard } from "@/components/admin-dashboard"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Loading Admin...</CardTitle>
              <CardDescription>Please wait while the dashboard loads.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-32">
              <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
            </CardContent>
          </Card>
        }
      >
        <AdminDashboard />
      </Suspense>
    </main>
  )
}
