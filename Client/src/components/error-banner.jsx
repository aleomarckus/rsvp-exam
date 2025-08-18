export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{
      background: '#fde2e1',
      color: '#811d1a',
      border: '1px solid #f9b4b0',
      padding: '8px 12px',
      borderRadius: 8,
      marginBottom: 12
    }}>
      {message}
    </div>
  )
}