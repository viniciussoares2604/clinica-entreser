import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'

const mercadoPagoPreferencesUrl = 'https://api.mercadopago.com/checkout/preferences'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Método não permitido.' })
  }

  try {
    const { studyGroup, participant } = JSON.parse(event.body || '{}')

    validateCheckoutPayload(studyGroup, participant)

    const supabase = createSupabaseAdmin()
    const activeStudyGroup = await getActiveStudyGroup(supabase, studyGroup.id)
    const paymentPlan = getCardPaymentPlan(activeStudyGroup)
    const enrollment = await createEnrollment(supabase, activeStudyGroup, participant, paymentPlan)
    const preference = await createMercadoPagoPreference(activeStudyGroup, participant, enrollment.id, paymentPlan)

    await supabase
      .from('study_group_enrollments')
      .update({
        mercado_pago_preference_id: preference.id,
        checkout_url: preference.init_point,
      })
      .eq('id', enrollment.id)

    return jsonResponse(200, {
      enrollmentId: enrollment.id,
      checkoutUrl: preference.init_point,
      preferenceId: preference.id,
    })
  } catch (error) {
    console.error('create-study-group-checkout failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Não foi possível iniciar o checkout.',
    })
  }
}

async function getActiveStudyGroup(supabase, studyGroupId) {
  const { data, error } = await supabase
    .from('study_groups')
    .select('*')
    .eq('id', studyGroupId)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    throw new Error('Grupo de estudo indisponível para inscrição.')
  }

  return data
}

async function createEnrollment(supabase, studyGroup, participant, paymentPlan) {
  const { data, error } = await supabase
    .from('study_group_enrollments')
    .insert({
      study_group_id: studyGroup.id,
      participant_name: participant.name,
      participant_email: participant.email,
      participant_phone: participant.phone,
      professional_profile: participant.professionalProfile,
      amount_in_cents: paymentPlan.totalInCents,
      payment_status: 'pending',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

async function createMercadoPagoPreference(studyGroup, participant, enrollmentId, paymentPlan) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('Mercado Pago access token is missing.')
  }

  const siteUrl = getSiteUrl()
  const returnUrls = getReturnUrls(siteUrl, enrollmentId)
  const notificationUrl = getNotificationUrl(siteUrl)
  const preferencePayload = {
    items: [
      {
          id: studyGroup.id,
          title: studyGroup.title,
          description: `${studyGroup.subtitle} Pagamento total em ate ${paymentPlan.installments} parcelas.`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: paymentPlan.totalInCents / 100,
        },
      ],
      payment_methods: {
        installments: paymentPlan.installments,
        excluded_payment_types: [
          { id: 'bank_transfer' },
          { id: 'ticket' },
          { id: 'atm' },
        ],
      },
    payer: {
      name: participant.name,
      email: participant.email,
      phone: {
        number: participant.phone,
      },
    },
    external_reference: enrollmentId,
    metadata: {
      study_group_id: studyGroup.id,
      enrollment_id: enrollmentId,
    },
  }

  if (returnUrls) {
    preferencePayload.back_urls = returnUrls
    preferencePayload.auto_return = 'approved'
  }

  if (notificationUrl) {
    preferencePayload.notification_url = notificationUrl
  }

  const response = await fetch(mercadoPagoPreferencesUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencePayload),
  })

  const preference = await response.json()

  if (!response.ok) {
    throw new Error(preference.message || 'Mercado Pago recusou a criação do checkout.')
  }

  return preference
}

function getCardPaymentPlan(studyGroup) {
  const installmentMap = {
    'self-da-situacao-gestalt-2026': 5,
    'psicopatologia-critica-gestalt-fenomenologia-2026': 5,
  }
  const installments = installmentMap[studyGroup.id] || 1

  return {
    installments,
    monthlyInCents: studyGroup.price_in_cents,
    totalInCents: studyGroup.price_in_cents * installments,
  }
}

function validateCheckoutPayload(studyGroup, participant) {
  if (!studyGroup?.id) {
    throw new Error('Grupo de estudo inválido.')
  }

  if (!participant?.name || !participant?.email || !participant?.phone || !participant?.professionalProfile) {
    throw new Error('Preencha todos os dados de inscrição.')
  }
}

function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    'http://localhost:8888'
  ).replace(/\/$/, '')
}

function getReturnUrls(siteUrl, enrollmentId) {
  if (!isHttpsUrl(siteUrl)) {
    return null
  }

  return {
    success: `${siteUrl}/inscricao-confirmada?enrollment=${enrollmentId}`,
    failure: `${siteUrl}/grupos-de-estudos?payment=failure&enrollment=${enrollmentId}`,
    pending: `${siteUrl}/grupos-de-estudos?payment=pending&enrollment=${enrollmentId}`,
  }
}

function getNotificationUrl(siteUrl) {
  if (!isHttpsUrl(siteUrl)) {
    return null
  }

  return `${siteUrl}/.netlify/functions/mercado-pago-webhook`
}

function isHttpsUrl(url) {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
