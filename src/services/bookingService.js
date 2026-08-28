const BASE_URL = '/tutoring/booking'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Booking request failed: ${response.status} ${response.statusText}`)
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

export async function getAllBookings() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return parseJson(await handleErrors(response))
}

export async function getBookingById(bookingId) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(bookingId)}`)
  return parseJson(await handleErrors(response))
}

export async function createBooking(booking) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
  return parseJson(await handleErrors(response))
}

export async function updateBooking(booking) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
  return parseJson(await handleErrors(response))
}

export async function deleteBooking(bookingId) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(bookingId)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
