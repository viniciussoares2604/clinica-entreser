import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'

export async function handler(event) {
  const enrollmentId = event.queryStringParameters?.enrollmentId

  if (!enrollmentId) {
    return jsonResponse(400, { error: 'Codigo da inscricao nao informado.' })
  }

  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('study_group_enrollments')
      .select('id, payment_status, paid_at, notification_sent_at, study_groups(title)')
      .eq('id', enrollmentId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return jsonResponse(200, {
      enrollmentId: data.id,
      paymentStatus: data.payment_status,
      paidAt: data.paid_at,
      notificationSentAt: data.notification_sent_at,
      studyGroupTitle: data.study_groups?.title,
    })
  } catch (error) {
    console.error('get-study-group-enrollment-status failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Nao foi possivel consultar a inscricao.',
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
