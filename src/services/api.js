import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
})

function getFriendlyError(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The AI analysis request timed out. Please try again.'
    }

    return 'Unable to connect to the AI analysis server. Please make sure the backend is running.'
  }

  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    return detail
  }

  return 'The AI analysis server returned an error.'
}

export async function healthCheck() {
  try {
    const response = await api.get('/api/health')
    return response.data
  } catch (error) {
    throw new Error(getFriendlyError(error))
  }
}

export async function getClasses() {
  try {
    const response = await api.get('/api/classes')
    return response.data
  } catch (error) {
    throw new Error(getFriendlyError(error))
  }
}

export async function predictImage(file, threshold = 0.5, targetClass = '') {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('threshold', String(threshold))

    if (targetClass) {
      formData.append('target_class', targetClass)
    }

    const response = await api.post('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw new Error(getFriendlyError(error))
  }
}

export function resolveBackendUrl(path) {
  if (!path) {
    return ''
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

export async function downloadRemoteFile(url, filename) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Unable to download the generated file.')
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}