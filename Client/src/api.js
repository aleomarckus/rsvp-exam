import axios from 'axios'
import { getUsername } from './auth.js'

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use((config) => {
  const user = getUsername()
  if (user) config.headers['X-Username'] = user
  config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const data = err?.response?.data || {}
    const rawMsg =
      data.message || data.title || err?.message || 'Request failed'

    const e = new Error(
      status === 401 ? 'Please log in first.'
      : status === 403 ? 'You are not allowed to perform this action.'
      : status === 404 ? 'Not found.'
      : rawMsg
    )

    if (data && typeof data === 'object' && data.errors) {
      e.details = data.errors
    }
    e.status = status
    throw e
  }
)

export async function listPublicEvents() {
  const { data } = await http.get('/events')
  return data
}
export async function listMyEvents() {
  const { data } = await http.get('/events/my-events')
  return data
}

export async function createEvent(input) {
  const time = input.time.length === 5 ? input.time + ':00' : input.time;
  await http.post('/events', { ...input, time, timeZoneId: tz });
}

export async function updateEvent(id, input) {
  const time = input.time.length === 5 ? input.time + ':00' : input.time;
  await http.put(`/events/${id}`, { ...input, time, timeZoneId: tz });
}

export async function deleteEvent(id) {
  await http.delete(`/events/${id}`)
}

export async function rsvp(eventId) {
  const { data } = await http.post(`/rsvp/${eventId}`)
  return data // { eventId, currentRsvpCount, maxRsvpCount, alreadyRsvped, isFull }
}