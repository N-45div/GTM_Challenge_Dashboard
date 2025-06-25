export interface CampaignMetric {
  id: string
  title: string
  sendTime: string
  emailsSent: number
  openRate: number
  clickRate: number
  description?: string | null // Will be populated by Mailchimp's preview_text
}

export interface AdminMetrics {
  subscriberCount: number
  publishedNewsletterCount: number
  campaigns: CampaignMetric[] // Kept for recent campaigns
  totalOpenRate?: number // For aggregate open rate
  totalClickRate?: number // For aggregate click rate
}

export interface DailySubscriberGrowth {
  date: string
  newSubscribers: number
}

export interface NewsletterCampaign {
  id: string
  title: string
  archiveUrl: string
  sendTime: string
  description?: string | null
}
