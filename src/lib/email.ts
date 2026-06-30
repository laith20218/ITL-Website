import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/reset-password/${token}`

  await transporter.sendMail({
    from: `"ITL Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'إعادة تعيين كلمة المرور - ITL',
    html: `
      <div dir="rtl" style="font-family: 'Cairo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4AF37; font-size: 28px;">ITL — Idea To Life</h1>
        </div>
        <p style="font-size: 16px; color: #333;">مرحباً،</p>
        <p style="font-size: 16px; color: #333;">لقد طلبت إعادة تعيين كلمة المرور. اضغط على الرابط أدناه:</p>
        <a href="${resetLink}" style="display: inline-block; margin: 20px 0; padding: 12px 30px; background: linear-gradient(135deg, #D4AF37, #A8842B); color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">إعادة تعيين كلمة المرور</a>
        <p style="font-size: 14px; color: #666;">أو انسخ هذا الرابط: ${resetLink}</p>
        <p style="font-size: 14px; color: #999;">هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        <p style="font-size: 14px; color: #999;">إذا لم تطلب ذلك، تجاهل هذه الرسالة.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 ITL — Idea To Life</p>
      </div>
    `,
  })
}
