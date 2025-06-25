"use server"

interface AuthState {
  message: string
  success: boolean
}

export async function verifyAdminPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get("password") as string

  if (!password) {
    return { message: "Password cannot be empty.", success: false }
  }

  const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD

  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_DASHBOARD_PASSWORD environment variable is not set.")
    return { message: "Server configuration error. Please try again later.", success: false }
  }

  if (password === ADMIN_PASSWORD) {
    return { message: "Authentication successful!", success: true }
  } else {
    return { message: "Invalid password.", success: false }
  }
}
