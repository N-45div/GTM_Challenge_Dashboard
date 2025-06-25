"use server"

interface FormState {
  message: string
  success: boolean
}

export async function subscribeToNewsletter(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get("email") as string)?.trim()
  const firstName = (formData.get("firstName") as string)?.trim()

  if (!email || !email.includes("@")) {
    return { message: "Please enter a valid email address.", success: false }
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
    console.error("Missing Mailchimp environment variables.")
    return {
      message: "Server configuration error. Please try again later.",
      success: false,
    }
  }

  // Parse the data-center (dc) from the key (`xxxx-us1` → `us1`)
  const dc = MAILCHIMP_API_KEY.split("-")[1]
  if (!dc) {
    console.error("Invalid Mailchimp API key format.")
    return {
      message: "Server configuration error. Please try again later.",
      success: false,
    }
  }

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`
  const body = {
    email_address: email,
    status: "subscribed", // use "pending" for double opt-in
    merge_fields: {
      FNAME: firstName, // Mailchimp's default field for First Name
    },
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // any user name works; API key is the password
        Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()

    if (res.ok) {
      return { message: "Successfully subscribed! 🎉", success: true }
    }

    if (json.title === "Member Exists") {
      return { message: "This email is already subscribed.", success: false }
    }

    return {
      message: `Subscription failed: ${json.detail ?? "Unknown error."}`,
      success: false,
    }
  } catch (err) {
    console.error("Mailchimp error:", err)
    return {
      message: "Network error. Please try again later.",
      success: false,
    }
  }
}
