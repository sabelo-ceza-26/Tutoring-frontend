const BASE_URL = '/tutoring/payment'

function handleErrors(response) {
  if (!response.ok) {
    throw new Error(`Payment request failed: ${response.status} ${response.statusText}`)
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

export async function getAllPayments() {
  const response = await fetch(`${BASE_URL}/getAll`)
  return parseJson(await handleErrors(response))
}

export async function getPaymentById(paymentRef) {
  const response = await fetch(`${BASE_URL}/read/${encodeURIComponent(paymentRef)}`)
  return parseJson(await handleErrors(response))
}

export async function createPayment(payment) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  })
  return parseJson(await handleErrors(response))
}

export async function updatePayment(payment) {
  const response = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  })
  return parseJson(await handleErrors(response))
}

export async function deletePayment(paymentRef) {
  const response = await fetch(`${BASE_URL}/delete/${encodeURIComponent(paymentRef)}`, {
    method: 'DELETE'
  })
  handleErrors(response)
  return true
}
