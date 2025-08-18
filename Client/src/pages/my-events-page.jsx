import { useEffect, useState } from 'react'
import { createEvent, deleteEvent, listMyEvents, updateEvent } from '../api.js'
import EventForm from '../components/events/event-form.jsx'
import { getUsername } from '../auth.js'
import ErrorBanner from '../components/error-banner.jsx'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function MyEventsPage() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const user = getUsername()

  const load = async () => {
    setError(null)
    try {
      setItems(await listMyEvents())
    } catch (e) {
      setError(e?.message ?? 'Failed to load events.')
    }
  }

  useEffect(() => { load() }, [])

  if (!user) return <p>Please log in to manage your events.</p>

  const toFormVals = (ev) => ({
    name: ev.name,
    date: ev.date.slice(0, 10),
    time: ev.time.slice(0, 5),
    location: ev.location,
    description: ev.description ?? '',
    maxRsvpCount: ev.maxRsvpCount,
  })

  return (
    <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
      <h2 className="d-flex align-items-center gap-2">
        My Events
        {editing && <Badge bg="info" text="dark">Editing: {editing.name}</Badge>}
      </h2>

      <ErrorBanner message={error} />

      <EventForm
        submitText={editing ? 'Save' : 'Create'}
        initial={editing ? toFormVals(editing) : undefined}
        onCancel={() => setEditing(null)}
        onSubmit={async (v) => {
          try {
            if (editing) {
              await updateEvent(editing.id, v)
              setEditing(null)
            } else {
              await createEvent(v)
            }
            await load()
          } catch (e) {
            setError(e?.message ?? 'Failed to save.')
          }
        }}
      />

      <div>
        <h3 style={{ marginTop: 24 }}>Your Events</h3>
        <Row xs={1} md={2} lg={3} className="g-4 mt-1">
          {items.map((ev) => {
            const dateStr = ev.date.slice(0, 10)
            const timeStr = ev.time.slice(0, 5)
            return (
              <Col key={ev.id}>
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <div>
                      <Card.Title className="mb-1">{ev.name}</Card.Title>
                      <Card.Subtitle className="text-muted mb-2">{dateStr} {timeStr} • {ev.location}</Card.Subtitle>
                      {ev.description && <Card.Text className="mb-2">{ev.description}</Card.Text>}
                      <Badge bg="secondary" className="align-self-start">RSVPs: {ev.currentRsvpCount} / {ev.maxRsvpCount}</Badge>
                    </div>
                    <div className="mt-4 d-flex gap-2">
                      <Button variant="outline-primary" onClick={() => setEditing(ev)}>Edit</Button>
                      <Button
                        variant="outline-danger"
                        onClick={async () => {
                          if (!confirm('Delete this event?')) return
                          try {
                            await deleteEvent(ev.id)
                            await load()
                          } catch (e) {
                            setError(e?.message ?? 'Failed to delete.')
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
          {items.length === 0 && <em>No events Found.</em>}
        </Row>
      </div>
    </div>
  )
}