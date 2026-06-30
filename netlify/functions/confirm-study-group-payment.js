import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'
import { syncEnrollmentPayment } from './_shared/paymentSync.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Metodo nao permitido.' })
  }

  try {
    const { enrollmentId, paymentId } = JSON.parse(event.body || '{}')

    if (!enrollmentId || !paymentId) {
      return jsonResponse(400, { error: 'Dados de confirmacao incompletos.' })
    }

    const supabase = createSupabaseAdmin()
    const { payment } = await syncEnrollmentPayment({ supabase, enrollmentId, paymentId })

    return jsonResponse(200, {
      paymentStatus: payment.status,
      enrollmentId,
      paymentId: String(payment.id),
    })
  } catch (error) {
    console.error('confirm-study-group-payment failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Nao foi possivel confirmar o pagamento.',
    })
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
