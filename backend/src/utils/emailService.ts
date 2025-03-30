import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    console.log("Configuring email service with Gmail SMTP...")

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify transporter connection
    await transporter.verify()
    console.log("✅ Email service connection verified successfully")

    // Prepare email data with a proper sender name
    const mailOptions = {
      from: `"YADOM Account Security" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    console.log(`Sending email to: ${options.to}`)

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.response)

    return Promise.resolve()
  } catch (error) {
    console.error("❌ Email sending error:", error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

