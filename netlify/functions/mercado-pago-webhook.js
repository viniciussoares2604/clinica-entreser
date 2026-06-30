import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'
import { fetchMercadoPagoPayment } from './_shared/mercadoPago.js'
import { syncEnrollmentPayment } from './_shared/paymentSync.js'

export async function handler(event) {
  try {
    const paymentId = getPaymentId(event)

    if (!paymentId) {
      return jsonResponse(200, { received: true })
    }

    const payment = await fetchMercadoPagoPayment(paymentId)
    const enrollmentId = payment.external_reference || payment.metadata?.enrollment_id

    if (!enrollmentId) {
      return jsonResponse(200, { received: true })
    }

    const supabase = createSupabaseAdmin()
    await syncEnrollmentPayment({ supabase, enrollmentId, paymentId })

    return jsonResponse(200, { received: true })
  } catch (error) {
    console.error('mercado-pago-webhook failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Webhook nao processado.',
    })
  }
}

function getPaymentId(event) {
  const params = event.queryStringParameters || {}

  if (params.type === 'payment' && params['data.id']) {
    return params['data.id']
  }

  const body = JSON.parse(event.body || '{}')

  if (body.type === 'payment') {
    return body.data?.id
  }

  if (body.topic === 'payment') {
    return body.id || params.id
  }

  return null
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
