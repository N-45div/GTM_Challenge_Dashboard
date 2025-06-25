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

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository**:
    \`\`\`bash
    git clone [YOUR_ADMIN_REPOSITORY_URL]
    cd ai-insights-daily-admin
    \`\`\`
    *(Replace `[YOUR_ADMIN_REPOSITORY_URL]` with your actual repository URL)*

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    \`\`\`

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root of your project and add the following environment variables:

    \`\`\`env
    MAILCHIMP_API_KEY=your_mailchimp_api_key-usX # e.g., abcdef1234567890abcdef1234567890-us1
    MAILCHIMP_AUDIENCE_ID=your_mailchimp_audience_id # e.g., 1234567890
    ADMIN_DASHBOARD_PASSWORD=your_secure_admin_password
    NEXT_PUBLIC_VERCEL_URL=http://localhost:3001 # Or your Vercel deployment URL for the admin dashboard
    \`\`\`
    *   You can find your Mailchimp API Key and Audience ID in your Mailchimp account settings.
    *   Choose a strong password for `ADMIN_DASHBOARD_PASSWORD`.
    *   Note: You might want to run this on a different port (e.g., 3001) than your frontend app to avoid conflicts.

4.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    pnpm dev
    # or
    yarn dev
    \`\`\`

    Open [http://localhost:3001](http://localhost:3001) (or your chosen port) in your browser to access the admin dashboard.

## Usage

*   **Admin Dashboard**: Access the dashboard at the root URL (`/`). You will need to enter the `ADMIN_DASHBOARD_PASSWORD` configured in your environment variables to log in.
