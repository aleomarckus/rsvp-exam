import { useEffect, useState } from 'react'
import { listPublicEvents, rsvp } from '../api.js'
import { getUsername } from '../auth.js'
import ErrorBanner from '../components/error-banner.jsx'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

export default function PublicEventsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = getUsername()

  const load = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await listPublicEvents()
      setItems(data)
    } catch (e) {
      setError(e?.message ?? 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const handleRsvp = async (id) => {
    try {
      await rsvp(id)
      await load()
    } catch (e) {
      setError(e?.message ?? 'Failed to RSVP.')
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Upcoming Events</h2>
      <ErrorBanner message={error} />
      {loading && <Spinner animation="border" className="my-3" />}
      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {items.map((ev) => {
          const dateStr = ev.date.slice(0, 10)
          const timeStr = ev.time.slice(0, 5)
          const isFull = ev.currentRsvpCount >= ev.maxRsvpCount
          return (
            <Col key={ev.id}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{ev.name}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {dateStr} {timeStr} • {ev.location}
                  </Card.Subtitle>
                  {ev.description && <Card.Text>{ev.description}</Card.Text>}
                  <Badge bg={isFull ? 'danger' : 'secondary'} className="mb-2 align-self-start">
                    RSVPs: {ev.currentRsvpCount} / {ev.maxRsvpCount}
                  </Badge>
                  <div className="mt-auto">
                    {user ? (
                      <Button
                        variant={ev.isRsvped ? 'success' : 'primary'}
                        onClick={() => handleRsvp(ev.id)}
                        disabled={isFull || ev.isRsvped}
                      >
                        {ev.isRsvped ? 'RSVP’d!' : isFull ? 'Full' : 'RSVP'}
                      </Button>
                    ) : (
                      <span className="text-muted">Log in to RSVP</span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
        {items.length === 0 && !loading && <em>No events available.</em>}
      </Row>
    </div>
  )
}