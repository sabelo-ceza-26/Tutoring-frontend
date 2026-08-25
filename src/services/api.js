export const API_BASE =
  (typeof process !== 'undefined' && process.env && process.env.VUE_APP_API_URL) ||
  'http://localhost:8080/tutoring'
 
async function request(path, { method = 'GET', body, query } = {}) {
  let url = `${API_BASE}${path}`
 
  if (query) {
    const params = new URLSearchParams()
    Object.keys(query).forEach((key) => {
      if (query[key] !== undefined && query[key] !== null) params.append(key, query[key])
    })
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }
 
  const options = { method, headers: {} }
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
 
  let response
  try {
    response = await fetch(url, options)
  } catch (e) {
    throw new Error(
      'Cannot reach the backend. Make sure the Spring Boot app is running on ' + API_BASE
    )
  }
 
  if (response.status === 404) return null
  if (response.status === 204) return true
 
  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch (e) {
      data = text
    }
  }
 
  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) || `Request failed (${response.status})`
    throw new Error(message)
  }
 
  return data
}
 
export const api = {
  get: (path, query) => request(path, { method: 'GET', query }),
  post: (path, body, query) => request(path, { method: 'POST', body, query }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' })
}
 
export default api