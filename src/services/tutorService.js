const BASE_URL = '/tutoring/tutor'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Tutor request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

async function parseJson(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error('Invalid response from server')
  }
}

export async function getAllTutors() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return parseJson(await handleErrors(response))
}

export async function getTutorById(tutorId) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(tutorId)}`)
  return parseJson(await handleErrors(response))
}

export async function createTutor(tutor) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutor)
  })
  return parseJson(await handleErrors(response))
}

export async function updateTutor(tutor) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutor)
  })
  return parseJson(await handleErrors(response))
}

export async function deleteTutor(tutorId) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(tutorId)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
