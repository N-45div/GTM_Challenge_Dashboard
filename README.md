# AI Insights Daily Admin Dashboard

This project is a separate Next.js application providing a secure admin dashboard for monitoring the performance of the AI Insights Daily newsletter.

## Features

*   **Secure Login**: A password-protected admin dashboard to ensure only authorized users can access sensitive metrics.
*   **Key Metrics Overview**: Displays essential newsletter performance indicators:
    *   Total Subscribers
    *   Total Published Newsletters
    *   Average Open Rate
    *   Average Click Rate
*   **Recent Campaigns**: Lists the 5 most recent newsletter campaigns with their individual performance metrics (emails sent, open rate, click rate, and a truncated preview text).
*   **System Uptime Placeholder**: A section indicating where system uptime and reliability statistics could be integrated with a dedicated monitoring service.

## Technologies Used

*   **Next.js**: Utilizes the App Router for efficient routing, Server Components for performance, and Server Actions for secure backend logic (e.g., Mailchimp API calls, admin authentication).
*   **React**: For building interactive user interfaces.
*   **Tailwind CSS**: For utility-first styling and responsive design.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Mailchimp API**: Integrated for fetching subscriber and campaign performance data.
