import nodemailer from 'nodemailer'

interface EmailOptions {
    to: string
    subject: string
    text: string
    html?: string
  }
  
  export const sendEmail = async (options: EmailOptions): Promise<void> => {
  
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  
    return Promise.resolve()
  }
  
  