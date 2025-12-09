import Link from 'next/link';
import OrderForm from './components/OrderForm';

export default function Home() {
  return (
    <main className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, background: 'linear-gradient(to right, #f39c12, #e67e22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Forno Artigianale
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginTop: '1rem' }}>
          Prodotti tipici appena sfornati. Ordina online e ritira all'orario che preferisci.
        </p>
      </header>

      <OrderForm />

      <footer style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Link href="/staff/login" style={{
          textDecoration: 'none',
          color: 'var(--text-color)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(5px)',
          background: 'rgba(255,255,255,0.05)',
          transition: 'all 0.2s'
        }}>
          🔒 Accesso Staff
        </Link>
        <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>&copy; 2024 Forno Artigianale. Tutti i diritti riservati.</div>
      </footer>
    </main>
  );
}
