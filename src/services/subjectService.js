const BASE_URL = '/tutoring/subject'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Subject request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllSubjects() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getSubjectById(subjectCode) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(subjectCode)}`)
  return handleErrors(response).json()
}

export async function createSubject(subject) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject)
  })
  return handleErrors(response).json()
}

export async function updateSubject(subject) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject)
  })
  return handleErrors(response).json()
}

export async function deleteSubject(subjectCode) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(subjectCode)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
