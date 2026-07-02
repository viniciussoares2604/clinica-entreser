import { studyGroupsSeed, studyGroupStatus } from '../data/studyGroups'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient'

const studyGroupMedia = {
  'self-da-situacao-gestalt-2026': {
    bannerImage: '/grupo-self-situacao.jpeg',
    bannerPosition: 'center center',
    contactWhatsapp: '5585996189558',
    installmentCount: 5,
  },
  'psicopatologia-critica-gestalt-fenomenologia-2026': {
    bannerImage: '/grupo-psicopatologia-critica.jpeg',
    bannerPosition: 'center center',
    contactWhatsapp: '5585981417741',
    installmentCount: 5,
  },
}

export async function listActiveStudyGroups() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('status', studyGroupStatus.active)
      .order('starts_at', { ascending: true })

    if (!error && data?.length) {
      return data.map(mapStudyGroupFromSupabase)
    }

    console.warn('Supabase study_groups unavailable, using local seed.', error)
  }

  return studyGroupsSeed.filter((group) => group.status === studyGroupStatus.active)
}

export async function createStudyGroupEnrollment({ studyGroup, participant }) {
  const response = await fetch('/.netlify/functions/create-study-group-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studyGroup,
      participant,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível registrar sua inscrição.')
  }

  return payload
}

async function requestManageStudyGroup(method, payload) {
  const adminToken = window.localStorage.getItem('entreser-admin-token')
  const response = await fetch('/.netlify/functions/manage-study-group', {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken || ''}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível salvar o curso.')
  }

  return data
}

export async function createStudyGroup(groupData) {
  return requestManageStudyGroup('POST', groupData)
}

export async function updateStudyGroup(groupData) {
  return requestManageStudyGroup('PUT', groupData)
}

export async function deleteStudyGroup(groupId) {
  return requestManageStudyGroup('DELETE', { id: groupId })
}

export async function uploadStudyGroupImage(file) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase não está configurado para upload de imagens.')
  }

  const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9\.\-_]/g, '-')}`
  const { data, error } = await supabase.storage
    .from('study-group-images')
    .upload(safeFileName, file, { upsert: true })

  if (error) {
    throw new Error(error.message)
  }

  const { data: publicUrlData, error: publicUrlError } = await supabase.storage
    .from('study-group-images')
    .getPublicUrl(safeFileName)

  if (publicUrlError) {
    throw new Error(publicUrlError.message)
  }

  return publicUrlData.publicUrl
}

export async function createStudyGroupPixEnrollment({ studyGroup, participant }) {
  const response = await fetch('/.netlify/functions/create-monthly-pix-enrollment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studyGroup,
      participant,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível registrar sua inscrição.')
  }

  return payload
}

export const createMonthlyPixEnrollment = createStudyGroupPixEnrollment

function mapStudyGroupFromSupabase(group) {
  const media = studyGroupMedia[group.id] || {}

  return {
    id: group.id,
    title: group.title,
    subtitle: group.subtitle,
    status: group.status,
    audience: group.audience,
    format: group.format,
    schedule: group.schedule,
    startsAt: group.starts_at,
    duration: group.duration,
    seatsAvailable: group.seats_available,
    priceInCents: group.price_in_cents,
    installmentCount: group.installment_count || media.installmentCount,
    pixPaymentType: group.pix_payment_type || 'none',
    facilitator: group.facilitator,
    highlights: group.highlights || [],
    bannerImage: group.banner_image || media.bannerImage,
    bannerPosition: group.banner_position || media.bannerPosition,
    contactWhatsapp: group.contact_whatsapp || media.contactWhatsapp,
  }
}
