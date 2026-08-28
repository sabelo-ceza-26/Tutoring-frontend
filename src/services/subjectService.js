const BASE_URL = '/tutoring/subject'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Subject request failed: ${response.status} ${response.statusText}`)
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

export async function getAllSubjects() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return parseJson(await handleErrors(response))
}

export async function getSubjectById(subjectCode) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(subjectCode)}`)
  return parseJson(await handleErrors(response))
}

export async function createSubject(subject) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject)
  })
  return parseJson(await handleErrors(response))
}

export async function updateSubject(subject) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject)
  })
  return parseJson(await handleErrors(response))
}

export async function deleteSubject(subjectCode) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(subjectCode)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
