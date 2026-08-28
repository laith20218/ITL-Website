import { Resend } from 'resend';

export async function sendPasswordResetEmail(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY
  const appUrl = process.env.NEXTAUTH_URL
  if (!apiKey || !appUrl) throw new Error('Password reset email is not configured')

  const resend = new Resend(apiKey)
  const resetLink = `${appUrl.replace(/\/$/, '')}/reset-password/${token}`;

  await resend.emails.send({
    from: 'ITL <onboarding@resend.dev>', // مؤقت، يمكنك تغييره لاحقاً بعد إضافة نطاقك
    to: email,
    subject: 'إعادة تعيين كلمة المرور - ITL',
    html: `
      <p>مرحباً،</p>
      <p>لقد طلبت إعادة تعيين كلمة المرور. اضغط على الرابط أدناه:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
      <p>إذا لم تطلب ذلك، تجاهل هذه الرسالة.</p>
    `,
  });
}
