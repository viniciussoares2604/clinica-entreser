import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Metodo nao permitido.' })
  }

  try {
    const { studyGroup, participant } = JSON.parse(event.body || '{}')

    validatePayload(studyGroup, participant)

    const supabase = createSupabaseAdmin()
    const activeStudyGroup = await getActiveStudyGroup(supabase, studyGroup.id)
    const enrollment = await createEnrollment(supabase, activeStudyGroup, participant)

    return jsonResponse(200, {
      enrollmentId: enrollment.id,
      studyGroupTitle: activeStudyGroup.title,
      amountInCents: activeStudyGroup.price_in_cents,
    })
  } catch (error) {
    console.error('create-monthly-pix-enrollment failed:', error)

    return jsonResponse(500, {
      error: error.message || 'Nao foi possivel registrar a inscricao via Pix.',
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
    throw new Error('Grupo de estudo indisponivel para inscricao.')
  }

  return data
}

async function createEnrollment(supabase, studyGroup, participant) {
  const { data, error } = await supabase
    .from('study_group_enrollments')
    .insert({
      study_group_id: studyGroup.id,
      participant_name: participant.name,
      participant_email: participant.email,
      participant_phone: participant.phone,
      professional_profile: participant.professionalProfile,
      amount_in_cents: studyGroup.price_in_cents,
      payment_status: 'pending_pix_manual',
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

function validatePayload(studyGroup, participant) {
  if (!studyGroup?.id) {
    throw new Error('Grupo de estudo invalido.')
  }

  if (!participant?.name || !participant?.email || !participant?.phone || !participant?.professionalProfile) {
    throw new Error('Preencha todos os dados de inscricao.')
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
