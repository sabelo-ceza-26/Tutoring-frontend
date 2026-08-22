const BASE_URL = '/tutoring/student'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Student request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllStudents() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getStudentById(studentNumber) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(studentNumber)}`)
  return handleErrors(response).json()
}

export async function createStudent(student) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return handleErrors(response).json()
}

export async function updateStudent(student) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return handleErrors(response).json()
}

export async function deleteStudent(studentNumber) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(studentNumber)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
