import { NextResponse } from "next/server"
import type { NewsletterCampaign } from "@/lib/types"

export async function GET() {
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY

  if (!MAILCHIMP_API_KEY) {
    console.error("API Campaigns Route: Missing Mailchimp environment variables.")
    return NextResponse.json({ error: "Server configuration error: Missing Mailchimp API Key." }, { status: 500 })
  }

  const dc = MAILCHIMP_API_KEY.split("-")[1]
  if (!dc) {
    console.error("API Campaigns Route: Invalid Mailchimp API key format.")
    return NextResponse.json(
      { error: "Server configuration error: Invalid Mailchimp API key format." },
      { status: 500 },
    )
  }

  const authHeader = `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64")}`

  try {
    // Fetch Sent Campaigns from Mailchimp
    const mailchimpRes = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/campaigns?status=sent&count=50&fields=campaigns.id,campaigns.settings.title,campaigns.long_archive_url,campaigns.send_time,campaigns.preview_text`,
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!mailchimpRes.ok) {
      const errorData = await mailchimpRes.json()
      console.error("API Campaigns Route: Mailchimp API error fetching campaigns:", errorData)
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch campaigns from Mailchimp." },
        { status: mailchimpRes.status },
      )
    }

    const data = await mailchimpRes.json()

    const campaigns: NewsletterCampaign[] = (data.campaigns || []).map((campaign: any) => {
      return {
        id: campaign.id,
        title: campaign.settings.title,
        archiveUrl: campaign.long_archive_url,
        sendTime: campaign.send_time,
        description: campaign.preview_text, // Use preview_text as description
      }
    })

    // Filter for unique titles to prevent React key warnings and redundant display
    const uniqueCampaigns = new Map<string, NewsletterCampaign>()
    campaigns.forEach((campaign) => {
      if (campaign.title) {
        uniqueCampaigns.set(campaign.title.trim(), campaign)
      }
    })

    return NextResponse.json(Array.from(uniqueCampaigns.values()))
  } catch (error) {
    console.error("API Campaigns Route: Error fetching Mailchimp campaigns:", error)
    return NextResponse.json({ error: "Failed to retrieve newsletter archives." }, { status: 500 })
  }
}
