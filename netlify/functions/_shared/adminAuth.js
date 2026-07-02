const adminUsername = 'lasteniasoares'
const adminPassword = 'entreser282715'
const adminSessionToken = 'entreser-admin-lasteniasoares'

export function validateAdminCredentials({ username, password }) {
  return username === adminUsername && password === adminPassword
}

export function getAdminSessionToken() {
  return adminSessionToken
}

export function isAdminAuthorized(event) {
  const authorization = event.headers.authorization || event.headers.Authorization || ''
  const token = authorization.replace(/^Bearer\s+/i, '') || event.headers['x-admin-token']

  return token === adminSessionToken
}
