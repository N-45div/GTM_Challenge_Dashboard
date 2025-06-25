"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { subscribeToNewsletter } from "@/app/actions/mailchimp"
import { CheckCircle2, XCircle } from "lucide-react"

const initialState = { message: "", success: false }

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Join Our AI Newsletter</CardTitle>
        <CardDescription>Stay updated with the latest in AI. No spam, just insights!</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" type="text" placeholder="John" disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="your@example.com" required disabled={pending} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Subscribing..." : "Subscribe"}
          </Button>

          {state.message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {state.success ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <p className="text-sm">{state.message}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
