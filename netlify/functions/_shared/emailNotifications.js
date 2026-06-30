import nodemailer from 'nodemailer'

export async function sendEnrollmentApprovedEmail({ enrollment, studyGroup, payment }) {
  const email = buildEnrollmentApprovedEmail({ enrollment, studyGroup, payment })

  if (hasSmtpConfig()) {
    return sendWithSmtp(email)
  }

  if (hasResendConfig()) {
    return sendWithResend(email)
  }

  console.warn('Enrollment notification email skipped: missing email environment variables.')
  return { sent: false, skipped: true }
}

function buildEnrollmentApprovedEmail({ enrollment, studyGroup, payment }) {
  const amount = formatCurrency(enrollment.amount_in_cents)

  return {
    from: process.env.CLINIC_NOTIFICATION_EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.CLINIC_NOTIFICATION_EMAIL_TO,
    subject: `Inscricao confirmada - ${studyGroup?.title || 'Grupo de estudos'}`,
    html: `
      <h1>Nova inscricao confirmada</h1>
      <p>Um pagamento foi aprovado pelo Mercado Pago.</p>
      <h2>Participante</h2>
      <p><strong>Nome:</strong> ${escapeHtml(enrollment.participant_name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(enrollment.participant_email)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(enrollment.participant_phone)}</p>
      <p><strong>Perfil profissional:</strong> ${escapeHtml(enrollment.professional_profile)}</p>
      <h2>Grupo</h2>
      <p><strong>Grupo:</strong> ${escapeHtml(studyGroup?.title || enrollment.study_group_id)}</p>
      <p><strong>Valor:</strong> ${amount}</p>
      <p><strong>Codigo da inscricao:</strong> ${enrollment.id}</p>
      <p><strong>ID do pagamento:</strong> ${payment?.id || enrollment.mercado_pago_payment_id || '-'}</p>
    `,
  }
}

async function sendWithSmtp(email) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const result = await transporter.sendMail({
    from: email.from,
    to: email.to,
    subject: email.subject,
    html: email.html,
  })

  return { sent: true, id: result.messageId }
}

async function sendWithResend(email) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!email.from || !email.to) {
    console.warn('Enrollment notification email skipped: missing sender or recipient.')
    return { sent: false, skipped: true }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: email.from,
      to: email.to.split(',').map((address) => address.trim()).filter(Boolean),
      subject: email.subject,
      html: email.html,
    }),
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'Nao foi possivel enviar o e-mail de confirmacao.')
  }

  return { sent: true, id: result.id }
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CLINIC_NOTIFICATION_EMAIL_TO)
}

function hasResendConfig() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CLINIC_NOTIFICATION_EMAIL_FROM &&
      process.env.CLINIC_NOTIFICATION_EMAIL_TO,
  )
}

function formatCurrency(amountInCents) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100)
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
