import { createSupabaseAdmin } from './_shared/supabaseAdmin.js'
import { isAdminAuthorized } from './_shared/adminAuth.js'

export async function handler(event) {
  if (!['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
    return jsonResponse(405, { error: 'Método não permitido.' })
  }

  try {
    if (!isAdminAuthorized(event)) {
      return jsonResponse(401, { error: 'Acesso administrativo não autorizado.' })
    }

    const payload = JSON.parse(event.body || '{}')
    const supabase = createSupabaseAdmin()

    if (event.httpMethod === 'DELETE') {
      return await deleteStudyGroup(supabase, payload)
    }

    validateGroupPayload(payload)

    if (event.httpMethod === 'POST') {
      return await createStudyGroup(supabase, payload)
    }

    return await updateStudyGroup(supabase, payload)
  } catch (error) {
    console.error('manage-study-group failed:', error)
    return jsonResponse(500, {
      error: error.message || 'Não foi possível processar a solicitação.',
    })
  }
}

async function createStudyGroup(supabase, payload) {
  const group = normalizeGroupPayload(payload)
  const { data, error } = await supabase
    .from('study_groups')
    .insert(group)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return jsonResponse(200, { group: data })
}

async function updateStudyGroup(supabase, payload) {
  const group = normalizeGroupPayload(payload)
  const { data, error } = await supabase
    .from('study_groups')
    .update(group)
    .eq('id', group.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return jsonResponse(200, { group: data })
}

async function deleteStudyGroup(supabase, payload) {
  if (!payload?.id) {
    throw new Error('ID do grupo é obrigatório para remoção.')
  }

  const { data, error } = await supabase
    .from('study_groups')
    .update({ status: 'closed', updated_at: new Date().toISOString() })
    .eq('id', payload.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return jsonResponse(200, { group: data })
}

function validateGroupPayload(payload) {
  if (!payload?.title || !payload?.subtitle || !payload?.starts_at || !payload?.duration || !payload?.format || !payload?.schedule || !payload?.price_in_cents) {
    throw new Error('Preencha todos os campos obrigatórios do curso.')
  }
}

function normalizeGroupPayload(payload) {
  return {
    id: payload.id,
    title: payload.title,
    subtitle: payload.subtitle,
    status: payload.status || 'active',
    audience: payload.audience || '',
    format: payload.format,
    schedule: payload.schedule,
    starts_at: payload.starts_at,
    duration: payload.duration,
    seats_available: Number(payload.seats_available) || 20,
    price_in_cents: Number(payload.price_in_cents),
    installment_count: Number(payload.installment_count) || 1,
    pix_payment_type: payload.pix_payment_type || 'monthly',
    facilitator: payload.facilitator || '',
    banner_image: payload.banner_image || '',
    banner_position: payload.banner_position || 'center center',
    contact_whatsapp: payload.contact_whatsapp || '',
    highlights: Array.isArray(payload.highlights)
      ? payload.highlights
      : typeof payload.highlights === 'string'
      ? payload.highlights.split('\n').map((item) => item.trim()).filter(Boolean)
      : [],
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
