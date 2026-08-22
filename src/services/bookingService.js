const BASE_URL = '/tutoring/booking'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Booking request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllBookings() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getBookingById(bookingId) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(bookingId)}`)
  return handleErrors(response).json()
}

export async function createBooking(booking) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
  return handleErrors(response).json()
}

export async function updateBooking(booking) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
  return handleErrors(response).json()
}

export async function deleteBooking(bookingId) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(bookingId)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
