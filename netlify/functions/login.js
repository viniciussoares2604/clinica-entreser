import { getAdminSessionToken, validateAdminCredentials } from './_shared/adminAuth.js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Método não permitido.' })
  }

  try {
    const { username, password } = JSON.parse(event.body || '{}')

    if (validateAdminCredentials({ username, password })) {
      return jsonResponse(200, {
        authenticated: true,
        token: getAdminSessionToken(),
      })
    }

    return jsonResponse(401, { error: 'Usuário ou senha inválidos.' })
  } catch (error) {
    return jsonResponse(500, { error: 'Não foi possível processar o login.' })
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
