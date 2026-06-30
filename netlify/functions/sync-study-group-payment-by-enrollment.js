import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'
import { syncEnrollmentPayment } from './_shared/paymentSync.js'

const mercadoPagoPaymentSearchUrl = 'https://api.mercadopago.com/v1/payments/search'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Metodo nao permitido.' })
  }

  try {
    const { enrollmentId } = JSON.parse(event.body || '{}')

    if (!enrollmentId) {
      return jsonResponse(400, { error: 'Codigo da inscricao nao informado.' })
    }

    const supabase = createSupabaseAdmin()
    const payment = await findPaymentByEnrollment(enrollmentId)

    if (!payment) {
      const enrollment = await getEnrollmentStatus(supabase, enrollmentId)

      return jsonResponse(200, {
        enrollmentId,
        paymentStatus: enrollment.payment_status,
        synced: false,
      })
    }

    const { payment: syncedPayment } = await syncEnrollmentPayment({
      supabase,
      enrollmentId,
      paymentId: payment.id,
    })

    return jsonResponse(200, {
      enrollmentId,
      paymentId: String(syncedPayment.id),
      paymentStatus: syncedPayment.status,
      synced: true,
    })
  } catch (error) {
    console.error('sync-study-group-payment-by-enrollment failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Nao foi possivel sincronizar o pagamento.',
    })
  }
}

async function findPaymentByEnrollment(enrollmentId) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('Mercado Pago access token is missing.')
  }

  const params = new URLSearchParams({
    external_reference: enrollmentId,
    sort: 'date_created',
    criteria: 'desc',
    limit: '10',
  })
  const response = await fetch(`${mercadoPagoPaymentSearchUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message || 'Nao foi possivel buscar pagamentos no Mercado Pago.')
  }

  const payments = payload.results || []
  return payments.find((payment) => payment.status === 'approved') || payments[0] || null
}

async function getEnrollmentStatus(supabase, enrollmentId) {
  const { data, error } = await supabase
    .from('study_group_enrollments')
    .select('id, payment_status')
    .eq('id', enrollmentId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
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
