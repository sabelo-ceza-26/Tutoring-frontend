const BASE_URL = '/tutoring/student'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Student request failed: ${response.status} ${response.statusText}`)
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

export async function getAllStudents() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return parseJson(await handleErrors(response))
}

export async function getStudentById(studentNumber) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(studentNumber)}`)
  return parseJson(await handleErrors(response))
}

export async function createStudent(student) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return parseJson(await handleErrors(response))
}

export async function updateStudent(student) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return parseJson(await handleErrors(response))
}

export async function deleteStudent(studentNumber) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(studentNumber)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
