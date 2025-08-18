import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, validateNotPastMinute } from '../../validation/event.js'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

export default function EventForm({ initial, onSubmit, submitText, onCancel }) {
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    setError,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      location: '',
      description: '',
      maxRsvpCount: 20,
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name ?? '',
        date: initial.date ?? new Date().toISOString().slice(0, 10),
        time: (initial.time ?? '09:00').slice(0, 5),
        location: initial.location ?? '',
        description: initial.description ?? '',
        maxRsvpCount: initial.maxRsvpCount ?? 20,
      })
    } else {
      reset()
    }
  }, [initial, reset])

  useEffect(() => {
    const t = watch('time')
    if (t && t.length === 8 && t.endsWith(':00')) {
      setValue('time', t.slice(0, 5), { shouldDirty: false })
    }
  }, [watch, setValue])

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    if (!validateNotPastMinute(values)) {
      setError('time', { type: 'server', message: 'Selected date & time is in the past.' })
      return
    }
    try {
      await onSubmit(values)
    } catch (e) {
      if (e?.details && typeof e.details === 'object') {
        for (const [key, arr] of Object.entries(e.details)) {
          const msg = Array.isArray(arr) ? arr[0] : String(arr)
          const field = key === 'DateTime' ? 'time' : key.charAt(0).toLowerCase() + key.slice(1)
          setError(field, { type: 'server', message: msg })
        }
        setFormError('Please fix the highlighted fields.')
      } else {
        setFormError(e?.message ?? 'Something went wrong.')
      }
    }
    finally {
      reset()
    }
  })

  return (
    <Form onSubmit={submit}>
      {formError && <Alert variant="danger" className="mb-3">{formError}</Alert>}
      <Row className="g-3">
        <Col md={12}>
          <Form.Group controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control type="text" placeholder="Event Name" isInvalid={!!errors.name} {...register('name')} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="eventDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" isInvalid={!!errors.date} {...register('date')} />
            <Form.Control.Feedback type="invalid">{errors.date?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="eventTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" isInvalid={!!errors.time} {...register('time')} />
            <Form.Control.Feedback type="invalid">{errors.time?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="eventLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Location" isInvalid={!!errors.location} {...register('location')} />
            <Form.Control.Feedback type="invalid">{errors.location?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="eventDescription">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Description" isInvalid={!!errors.description} {...register('description')} />
            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="eventMax">
            <Form.Label>Max RSVP Count</Form.Label>
            <Form.Control type="number" min={1} isInvalid={!!errors.maxRsvpCount} {...register('maxRsvpCount', { valueAsNumber: true })} />
            <Form.Control.Feedback type="invalid">{errors.maxRsvpCount?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12} className="d-flex gap-2 mt-2">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner animation="border" size="sm" className="me-2" />}
            {isSubmitting ? 'Saving…' : submitText}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          {!isSubmitting && !isDirty && <span className="text-muted align-self-center">No changes</span>}
        </Col>
      </Row>
    </Form>
  )
}