import { getAllStudents, getStudentById, updateStudent } from './studentService'
import { getAllTutors, getTutorById, updateTutor } from './tutorService'
import { getAdminById } from './adminService'

const SESSION_KEY = 'tutoring_session'

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function updateSession(changes) {
  const session = getSession()
  if (!session) {
    return null
  }
  const updated = { ...session, ...changes }
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  return updated
}

export function isLoggedIn() {
  return getSession() !== null
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export async function loginStudent(email, password) {
  const students = await getAllStudents()
  const student = students.find(s => s.email === email && s.password === password)
  if (!student) {
    throw new Error('Invalid email or password')
  }
  const session = {
    role: 'student',
    id: student.studentNumber,
    name: `${student.firstName} ${student.lastName}`,
    email: student.email
  }
  saveSession(session)
  return session
}

export async function loginTutor(email, password) {
  const tutors = await getAllTutors()
  const tutor = tutors.find(t => t.email === email && t.password === password)
  if (!tutor) {
    throw new Error('Invalid email or password')
  }
  const session = {
    role: 'tutor',
    id: tutor.tutorId,
    name: `${tutor.firstName} ${tutor.lastName}`,
    email: tutor.email
  }
  saveSession(session)
  return session
}

export async function loginAdmin(adminId) {
  const admin = await getAdminById(adminId)
  if (!admin) {
    throw new Error('Admin not found')
  }
  const session = {
    role: 'admin',
    id: admin.adminId,
    name: admin.role || 'Administrator',
    email: ''
  }
  saveSession(session)
  return session
}

export async function changeStudentPassword(studentNumber, currentPassword, newPassword) {
  const student = await getStudentById(studentNumber)
  if (student.password !== currentPassword) {
    throw new Error('Current password is incorrect')
  }
  await updateStudent({ ...student, password: newPassword })
}

export async function changeTutorPassword(tutorId, currentPassword, newPassword) {
  const tutor = await getTutorById(tutorId)
  if (tutor.password !== currentPassword) {
    throw new Error('Current password is incorrect')
  }
  await updateTutor({ ...tutor, password: newPassword })
}
