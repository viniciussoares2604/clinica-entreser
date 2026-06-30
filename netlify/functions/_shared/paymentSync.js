import { sendEnrollmentApprovedEmail } from './emailNotifications.js'
import { fetchMercadoPagoPayment } from './mercadoPago.js'

export async function syncEnrollmentPayment({ supabase, enrollmentId, paymentId }) {
  const payment = await fetchMercadoPagoPayment(paymentId)
  const paymentEnrollmentId = payment.external_reference || payment.metadata?.enrollment_id

  if (paymentEnrollmentId && paymentEnrollmentId !== enrollmentId) {
    throw new Error('Pagamento nao pertence a esta inscricao.')
  }

  const { data: enrollment, error } = await supabase
    .from('study_group_enrollments')
    .update({
      payment_status: payment.status,
      mercado_pago_payment_id: String(payment.id),
      payment_details: payment,
      paid_at: payment.status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', enrollmentId)
    .select('*, study_groups(*)')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (payment.status === 'approved' && !enrollment.notification_sent_at) {
    await notifyClinicAboutEnrollment({ supabase, enrollment, payment })
  }

  return {
    enrollment,
    payment,
  }
}

async function notifyClinicAboutEnrollment({ supabase, enrollment, payment }) {
  try {
    const emailResult = await sendEnrollmentApprovedEmail({
      enrollment,
      studyGroup: enrollment.study_groups,
      payment,
    })

    if (emailResult.sent) {
      const { error } = await supabase
        .from('study_group_enrollments')
        .update({
          notification_sent_at: new Date().toISOString(),
          notification_error: null,
        })
        .eq('id', enrollment.id)

      if (error) {
        console.warn('Could not persist notification_sent_at:', error.message)
      }
    }
  } catch (error) {
    console.error('Enrollment notification email failed:', error)

    const { error: updateError } = await supabase
      .from('study_group_enrollments')
      .update({
        notification_error: error.message || 'Erro ao enviar notificacao.',
      })
      .eq('id', enrollment.id)

    if (updateError) {
      console.warn('Could not persist notification_error:', updateError.message)
    }
  }
}
