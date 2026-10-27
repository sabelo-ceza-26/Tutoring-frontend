import { getAllStudents } from '@/services/studentService'

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

export async function getTutorSessions(tutorId) {
  const [tutor, students] = await Promise.all([
    getTutorById(tutorId),
    getAllStudents()
  ])

  const bookings = (tutor && tutor.bookings) || []

  const studentByBooking = new Map()
  for (const s of students || []) {
    for (const b of s.bookings || []) {
      if (!b || !b.bookingId) continue
      studentByBooking.set(b.bookingId, {
        studentNumber: s.studentNumber,
        studentName: `${s.firstName || ''} ${s.lastName || ''}`.trim() || `Student ${s.studentNumber}`
      })
    }
  }

  return bookings.map((b) => {
    const student = studentByBooking.get(b.bookingId)
    return {
      ...b,
      studentNumber: b.studentNumber || (student ? student.studentNumber : ''),
      studentName: b.studentName || (student ? student.studentName : '')
    }
  })
}
