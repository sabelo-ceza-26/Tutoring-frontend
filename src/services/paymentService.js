const BASE_URL = '/tutoring/payment'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Payment request failed: ${response.status} ${response.statusText}`)
  }
  return response
}

export async function getAllPayments() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return handleErrors(response).json()
}

export async function getPaymentById(paymentRef) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(paymentRef)}`)
  return handleErrors(response).json()
}

export async function createPayment(payment) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  })
  return handleErrors(response).json()
}

export async function updatePayment(payment) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  })
  return handleErrors(response).json()
}

export async function deletePayment(paymentRef) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(paymentRef)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
