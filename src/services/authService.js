export async function login({ username, password }) {
  const response = await fetch('/.netlify/functions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Usuário ou senha inválidos.')
  }

  return payload
}
