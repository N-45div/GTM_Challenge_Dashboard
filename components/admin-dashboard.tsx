"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyAdminPassword } from "@/app/actions/admin"
import type { AdminMetrics, CampaignMetric } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { truncateText } from "@/lib/utils"

const initialAuthState = { message: "", success: false }

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)

  const [authState, authAction, authPending] = useActionState(verifyAdminPassword, initialAuthState)

  useEffect(() => {
    if (authState.success) {
      setIsAuthenticated(true)
      setAuthError(null)
    } else if (authState.message) {
      setAuthError(authState.message)
    }
  }, [authState])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMetrics = async () => {
        setMetricsLoading(true)
        setMetricsError(null)
        try {
          const res = await fetch("/api/metrics") // Updated API route
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "Failed to fetch metrics.")
          }
          const data: AdminMetrics = await res.json()
          setMetrics(data)
        } catch (e: any) {
          setMetricsError(e.message || "An unexpected error occurred while fetching metrics.")
          console.error("Error fetching admin metrics:", e)
        } finally {
          setMetricsLoading(false)
        }
      }
      fetchMetrics()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter password to access dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={authAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={authPending} />
            </div>
            <Button type="submit" className="w-full" disabled={authPending}>
              {authPending ? "Verifying..." : "Login"}
            </Button>
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
        <CardDescription>Overview of your newsletter performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metricsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
          </div>
        ) : metricsError ? (
          <div className="text-red-500 text-center p-4">{metricsError}</div>
        ) : metrics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{metrics.subscriberCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Published Newsletters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{metrics.publishedNewsletterCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg. Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{metrics.totalOpenRate?.toFixed(1)}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avg. Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{metrics.totalClickRate?.toFixed(1)}%</p>
                </CardContent>
              </Card>
              {/* Placeholder for System Uptime */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">System Uptime & Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Uptime statistics are not currently available through Mailchimp. This feature would require
                    integration with a dedicated monitoring service.
                  </p>
                </CardContent>
              </Card>
            </div>

            {metrics.campaigns && metrics.campaigns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Performance of your latest newsletters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.campaigns.map((campaign: CampaignMetric) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{truncateText(campaign.title, 50)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sent: {new Date(campaign.sendTime).toLocaleDateString()}
                          </p>
                          {campaign.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              {truncateText(campaign.description, 80)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Emails Sent: {campaign.emailsSent}</p>
                          <p className="text-sm">Open Rate: {campaign.openRate.toFixed(1)}%</p>
                          <p className="text-sm">Click Rate: {campaign.clickRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
