'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

interface OrderItem {
    productName: string;
    variant: string;
    quantity: number;
    unit: string;
    price: number;
}

interface Order {
    id: number;
    items: string; // JSON string
    pickupTime: string;
    notes: string | null;
    status: string;
    totalPrice: number;
    createdAt: string;
    customerName: string;
}

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [sortBy, setSortBy] = useState<'id' | 'pickup'>('pickup');

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.filter((o: Order) => o.status !== 'Completato'));
                setAllOrders(data);
            } else {
                const err = await res.json();
                console.error("Fetch error:", err);
                // Only alert in development or if critical debugging needed
                // For now, logging to console is better, but user needs to see it.
                // Let's console.error it with a clear prefix the user can screenshot.
                console.error("SERVER ERROR DETAILS:", err.details || err.error);
                // Also setting an error state to display in UI might be better?
                // But console is what they are looking at.
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const markCompleted = async (id: number) => {
        try {
            await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'Completato' }),
            });
            fetchOrders();
        } catch (e) {
            alert('Errore aggiornamento');
        }
    };

    const printOrder = (order: Order) => {
        const items: OrderItem[] = JSON.parse(order.items);
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Ordine #${order.id}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              h1 { border-bottom: 1px solid black; }
              .item { margin-bottom: 10px; }
              .meta { margin-top: 20px; font-weight: bold; font-size: 1.2em;}
            </style>
          </head>
          <body>
            <h1>Ordine #${order.id}</h1>
            <div class="meta">CLIENTE: ${order.customerName}</div>
            <div class="meta">RITIRO: ${order.pickupTime}</div>
            <div style="margin-bottom: 20px;">Inviato: ${new Date(order.createdAt).toLocaleTimeString()}</div>
            <hr/>
            ${items.map(item => `
              <div class="item">
                <strong>${item.productName}</strong><br/>
                ${item.variant}<br/>
                ${item.quantity} ${item.unit}
              </div>
            `).join('')}
            <hr/>
            ${order.notes ? `<div><strong>NOTE:</strong><br/>${order.notes}</div><hr/>` : ''}
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    const getSortedOrders = () => {
        return [...orders].sort((a, b) => {
            if (sortBy === 'id') return a.id - b.id;
            return a.pickupTime.localeCompare(b.pickupTime);
        });
    };

    const printStats = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            const html = `
                <html>
                  <head>
                    <title>Riepilogo Ordini</title>
                    <style>
                      body { font-family: sans-serif; padding: 20px; }
                      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
                      th { background: #eee; }
                      .counters { display: flex; gap: 20px; margin-bottom: 20px; font-size: 1.2em; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <h1>Riepilogo Ordini</h1>
                    <div class="counters">
                        <div>Totali: ${allOrders.length}</div>
                        <div>Completati: ${allOrders.filter(o => o.status === 'Completato').length}</div>
                        <div>In Attesa: ${allOrders.filter(o => o.status !== 'Completato').length}</div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Orario Ritiro</th>
                            <th>Data Ordine</th>
                            <th>Stato</th>
                            <th>Prodotti</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${allOrders.map(o => {
                const items: OrderItem[] = JSON.parse(o.items);
                const itemsStr = items.map(i => `${i.quantity}x ${i.productName} (${i.variant})`).join(', ');
                return `
                                <tr>
                                    <td>${o.id}</td>
                                    <td>${o.customerName}</td>
                                    <td>${o.pickupTime}</td>
                                    <td>${new Date(o.createdAt).toLocaleString()}</td>
                                    <td>${o.status}</td>
                                    <td>${itemsStr}</td>
                                </tr>
                            `;
            }).join('')}
                      </tbody>
                    </table>
                    <script>window.print();</script>
                  </body>
                </html>
             `;
            printWindow.document.write(html);
            printWindow.document.close();
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>Ordini</h1>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{ width: 'auto', margin: 0, padding: '5px 10px', fontSize: '0.9rem' }}
                    >
                        <option value="pickup">Ordina per Orario Ritiro</option>
                        <option value="id">Ordina per Numero (#)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowStats(true)} className="btn-primary" style={{ background: '#3498db', fontSize: '0.9rem', padding: '8px 16px' }}>📊 Statistiche</button>
                    <button onClick={fetchOrders} className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>Aggiorna</button>
                </div>
            </div>

            {showStats && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#2c3e50' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>Riepilogo e Statistiche</h2>
                            <button onClick={() => setShowStats(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem' }}>✕</button>
                        </div>

                        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Ordini Totali</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{allOrders.length}</div>
                                </div>
                                <div style={{ background: 'rgba(46, 204, 113, 0.2)', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Completati</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{allOrders.filter(o => o.status === 'Completato').length}</div>
                                </div>
                                <div style={{ background: 'rgba(241, 196, 15, 0.2)', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>In Attesa</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f1c40f' }}>{allOrders.filter(o => o.status !== 'Completato').length}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>Dettaglio Ordini</h3>
                                <button onClick={printStats} className="btn-primary" style={{ padding: '8px 16px' }}>🖨 Stampa Report</button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Orario Ritiro</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Stato</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Dettagli</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allOrders.map(o => {
                                        const items: OrderItem[] = JSON.parse(o.items);
                                        return (
                                            <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '10px' }}>{o.id}</td>
                                                <td style={{ padding: '10px' }}>{o.customerName}</td>
                                                <td style={{ padding: '10px' }}>{o.pickupTime}</td>
                                                <td style={{ padding: '10px' }}>
                                                    <span style={{
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                        background: o.status === 'Completato' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                                                        color: o.status === 'Completato' ? '#2ecc71' : '#f1c40f'
                                                    }}>{o.status}</span>
                                                </td>
                                                <td style={{ padding: '10px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {loading ? <p>Caricamento...</p> : null}

            <div className={styles.grid}>
                {orders.length === 0 && !loading && <p>Nessun ordine in attesa.</p>}
                {getSortedOrders().map(order => {
                    const items: OrderItem[] = JSON.parse(order.items);
                    return (
                        <div key={order.id} className={`glass-panel ${styles.card}`}>
                            <div className={styles.header}>
                                <span className={styles.id}>#{order.id}</span>
                                <span className={styles.time}>{order.pickupTime}</span>
                            </div>

                            <div className={styles.items}>
                                <div style={{ marginBottom: '1rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    Cliente: {order.customerName}
                                </div>
                                {items.map((item, i) => (
                                    <div key={i} className={styles.itemRow}>
                                        <strong>{item.quantity}x</strong> {item.productName} ({item.variant})
                                        {item.unit === 'kg' && ` (${item.quantity} kg)`}
                                    </div>
                                ))}
                            </div>

                            {order.notes && (
                                <div className={styles.notes}>
                                    Warning: {order.notes}
                                </div>
                            )}

                            <div className={styles.footer}>
                                <div>Invio: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div className={styles.actions}>
                                    <button onClick={() => printOrder(order)} style={{ background: 'none', border: '1px solid white', color: 'white', borderRadius: '4px', padding: '5px 10px' }}>🖨</button>
                                    <button onClick={() => markCompleted(order.id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Pronto</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
