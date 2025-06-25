import { NextResponse } from "next/server"
import type { AdminMetrics, CampaignMetric } from "@/lib/types" // Removed DailySubscriberGrowth

export async function GET() {
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
    console.error("Admin Metrics Route: Missing Mailchimp environment variables.")
    return NextResponse.json({ error: "Server configuration error: Missing Mailchimp API keys." }, { status: 500 })
  }

  const dc = MAILCHIMP_API_KEY.split("-")[1]
  if (!dc) {
    console.error("Admin Metrics Route: Invalid Mailchimp API key format.")
    return NextResponse.json(
      { error: "Server configuration error: Invalid Mailchimp API key format." },
      { status: 500 },
    )
  }

  const authHeader = `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64")}`

  try {
    // 1. Fetch Subscriber Count from Mailchimp
    const audienceRes = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}`, {
      headers: { Authorization: authHeader },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    let subscriberCount = 0
    if (audienceRes.ok) {
      const audienceData = await audienceRes.json()
      subscriberCount = audienceData.stats?.member_count || 0
    } else {
      console.error("Admin Metrics Route: Mailchimp API error fetching audience:", await audienceRes.json())
    }

    // 2. Daily Subscriber Growth (Removed as chart is removed)
    // const growthRes = await fetch(
    //   `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/growth-history?count=30`,
    //   {
    //     headers: { Authorization: authHeader },
    //     next: { revalidate: 300 },
    //   },
    // )
    // let dailyGrowth: DailySubscriberGrowth[] = []
    // if (growthRes.ok) {
    //   const growthData = await growthRes.json()
    //   dailyGrowth = (growthData.history || [])
    //     .map((item: any) => ({
    //       date: item.history_date,
    //       newSubscribers: item.subscribed,
    //     }))
    //     .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // } else {
    //   console.error("Admin Metrics Route: Mailchimp API error fetching growth history:", await growthRes.json())
    // }

    // 3. Fetch All Sent Campaigns from Mailchimp for count and metrics
    const campaignsRes = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/campaigns?status=sent&count=1000&fields=campaigns.id,campaigns.settings.title,campaigns.send_time,campaigns.report_summary.emails_sent,campaigns.report_summary.open_rate,campaigns.report_summary.click_rate,campaigns.preview_text`,
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 300 },
      },
    )

    let publishedNewsletterCount = 0
    let campaigns: CampaignMetric[] = []
    let totalEmailsSent = 0
    let totalOpens = 0
    let totalClicks = 0

    if (campaignsRes.ok) {
      const campaignsData = await campaignsRes.json()
      // Process campaigns for recent list and aggregate metrics
      const fetchedCampaigns = campaignsData.campaigns || []

      // Filter for unique titles to ensure accurate count and display
      const uniqueCampaignsMap = new Map<string, CampaignMetric>()

      fetchedCampaigns.forEach((campaign: any) => {
        const title = campaign.settings.title
        const normalizedTitle = title ? title.trim() : ""

        if (normalizedTitle && !uniqueCampaignsMap.has(normalizedTitle)) {
          const emailsSent = campaign.report_summary?.emails_sent || 0
          const openRate = (campaign.report_summary?.open_rate || 0) * 100
          const clickRate = (campaign.report_summary?.click_rate || 0) * 100

          totalEmailsSent += emailsSent
          totalOpens += emailsSent * (openRate / 100) // Calculate total opens
          totalClicks += emailsSent * (clickRate / 100) // Calculate total clicks

          uniqueCampaignsMap.set(normalizedTitle, {
            id: campaign.id,
            title: title,
            sendTime: campaign.send_time,
            emailsSent: emailsSent,
            openRate: openRate,
            clickRate: clickRate,
            description: campaign.preview_text, // Use preview_text as description
          })
        }
      })

      campaigns = Array.from(uniqueCampaignsMap.values())
      publishedNewsletterCount = campaigns.length // Correctly count unique campaigns

      // Sort campaigns by send time for "Recent Campaigns" display (most recent first)
      campaigns.sort((a, b) => new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime())
    } else {
      console.error("Admin Metrics Route: Mailchimp API error fetching campaigns:", await campaignsRes.json())
    }

    // Calculate aggregate open and click rates
    const totalOpenRate = totalEmailsSent > 0 ? (totalOpens / totalEmailsSent) * 100 : 0
    const totalClickRate = totalEmailsSent > 0 ? (totalClicks / totalEmailsSent) * 100 : 0

    const metrics: AdminMetrics = {
      subscriberCount,
      publishedNewsletterCount,
      // dailyGrowth, // Removed
      campaigns: campaigns.slice(0, 5), // Only show top 5 recent campaigns
      totalOpenRate,
      totalClickRate,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Admin Metrics Route: Error fetching admin metrics:", error)
    return NextResponse.json({ error: "Failed to retrieve admin metrics." }, { status: 500 })
  }
}
