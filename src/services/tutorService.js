const BASE_URL = '/tutoring/tutor'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Tutor request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllTutors() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getTutorById(tutorId) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(tutorId)}`)
  return handleErrors(response).json()
}

export async function createTutor(tutor) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutor)
  })
  return handleErrors(response).json()
}

export async function updateTutor(tutor) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutor)
  })
  return handleErrors(response).json()
}

export async function deleteTutor(tutorId) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(tutorId)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
