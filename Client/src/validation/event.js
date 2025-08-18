import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/

export const eventSchema = z.object({
  name: z.string().trim().min(1, 'Event name is required').max(200),
  date: z.string().regex(dateRegex, 'Use YYYY-MM-DD').refine((v) => {
    const today = new Date()
    const d = new Date(v + 'T00:00:00')
    return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }, 'Date cannot be in the past'),
  time: z.string().regex(timeRegex, 'Use HH:mm or HH:mm:ss'),
  location: z.string().trim().min(1, 'Location is required').max(300),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  maxRsvpCount: z.coerce.number().int().min(1, 'Minimum is 1').max(10000, 'Too large'),
})

export function validateNotPastMinute(values) {
  try {
    const time = values.time.length === 5 ? values.time + ':00' : values.time
    const dt = new Date(`${values.date}T${time}`)
    return dt.getTime() >= Date.now() - 60_000
  } catch {
    return true
  }
}