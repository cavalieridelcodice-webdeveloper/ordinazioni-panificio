'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/products';

export default function OrderForm() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [pickupTime, setPickupTime] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Failed to load products", err));
    }, []);

    const addToCart = (item: any) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    pickupTime,
                    notes,
                    totalPrice: total,
                    customerName
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Errore durante l\'invio');
            setStatus('success');
            setCart([]);
            setCart([]);
            setPickupTime('');
            setNotes('');
            setCustomerName('');
        } catch (e: any) {
            setStatus('error');
            setErrorMsg(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h1 style={{ color: '#2ecc71', fontSize: '2.5rem' }}>Ordine Ricevuto!</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Il tuo ordine è stato registrato con successo.</p>
                <button className="btn-primary" onClick={() => setStatus('idle')}>Effettua un altro ordine</button>
            </div>
        )
    }

    return (
        <div>
            <h2 style={{ marginTop: '0', marginBottom: '1.5rem' }}>Seleziona i Prodotti</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
            </div>

            <div className="glass-panel" style={{ marginTop: '3rem', padding: '2rem' }}>
                <h2 style={{ marginTop: 0 }}>Il Tuo Ordine</h2>
                {cart.length === 0 ? (
                    <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Nessun prodotto selezionato.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
                        {cart.map((item, i) => (
                            <li key={i} style={{
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                        {item.variant} • {item.quantity} {item.unit}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => removeFromCart(i)}
                                        style={{
                                            background: 'rgba(231, 76, 60, 0.2)',
                                            color: '#e74c3c',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}



                <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label>Orario di Ritiro (09:00 - 18:00)</label>
                        <input
                            type="time"
                            value={pickupTime}
                            onChange={e => setPickupTime(e.target.value)}
                            min="09:00"
                            max="18:00"
                            style={{ marginTop: '0.5rem', padding: '12px' }}
                            required
                        />
                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '5px' }}>
                            Seleziona un orario tra le 09:00 e le 18:00.
                        </p>
                    </div>

                    <div>
                        <label>Nome e Cognome</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Il tuo nome"
                            style={{ marginTop: '0.5rem', padding: '12px' }}
                            required
                        />
                    </div>

                    <div>
                        <label>Note Aggiuntive</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Allergie, richieste specifiche..."
                        />
                    </div>

                    {errorMsg && <div style={{ background: 'rgba(231, 76, 60, 0.2)', padding: '1rem', borderRadius: '8px', color: '#ff6b6b' }}>{errorMsg}</div>}

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '16px', fontSize: '1.1rem' }}
                        onClick={handleSubmit}
                        disabled={loading || cart.length === 0 || !pickupTime || !customerName}
                    >
                        {loading ? 'Invio in corso...' : 'Invia Ordine'}
                    </button>
                </div>
            </div>
        </div>
    )
}
