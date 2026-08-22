const BASE_URL = '/tutoring/admin'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Admin request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllAdmins() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getAdminById(adminId) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(adminId)}`)
  return handleErrors(response).json()
}

export async function createAdmin(admin) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  })
  return handleErrors(response).json()
}

export async function updateAdmin(admin) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(admin)
  })
  return handleErrors(response).json()
}

export async function deleteAdmin(adminId) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(adminId)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
