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
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editItems, setEditItems] = useState<OrderItem[]>([]);
    const [editCustomerName, setEditCustomerName] = useState('');
    const [editPickupTime, setEditPickupTime] = useState('');
    const [editNotes, setEditNotes] = useState('');

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

    const openEditModal = (order: Order) => {
        setEditingOrder(order);
        setEditItems(JSON.parse(order.items));
        setEditCustomerName(order.customerName);
        setEditPickupTime(order.pickupTime);
        setEditNotes(order.notes || '');
    };

    const saveOrderChanges = async () => {
        if (!editingOrder) return;

        try {
            const response = await fetch(`/api/orders/${editingOrder.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: JSON.stringify(editItems),
                    customerName: editCustomerName,
                    pickupTime: editPickupTime,
                    notes: editNotes,
                    status: editingOrder.status
                })
            });

            if (response.ok) {
                setEditingOrder(null);
                fetchOrders();
            } else {
                alert('Errore nel salvataggio');
            }
        } catch (e) {
            alert('Errore nel salvataggio');
        }
    };

    const deleteOrder = async (id: number) => {
        if (!confirm('Sei sicuro di voler eliminare questo ordine?')) return;

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchOrders();
            } else {
                alert('Errore nell\'eliminazione');
            }
        } catch (e) {
            alert('Errore nell\'eliminazione');
        }
    };

    const addNewItem = () => {
        setEditItems([...editItems, {
            productName: 'Panzerotto',
            variant: 'Mozzarella e Pomodoro',
            quantity: 1,
            unit: 'pz',
            price: 2.50
        }]);
    };

    const removeItem = (index: number) => {
        setEditItems(editItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...editItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setEditItems(newItems);
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
                    <a
                        href="/"
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        🏠 Torna agli Ordini
                    </a>
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

            {editingOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '20px'
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#2c3e50' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>Modifica Ordine #{editingOrder.id}</h2>
                            <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nome Cliente</label>
                                <input
                                    type="text"
                                    value={editCustomerName}
                                    onChange={(e) => setEditCustomerName(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Orario Ritiro</label>
                                <input
                                    type="time"
                                    value={editPickupTime}
                                    onChange={(e) => setEditPickupTime(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Note</label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={3}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold' }}>Prodotti</label>
                                    <button onClick={addNewItem} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>+ Aggiungi Prodotto</button>
                                </div>

                                {editItems.map((item, index) => (
                                    <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Prodotto</label>
                                                <select
                                                    value={item.productName}
                                                    onChange={(e) => updateItem(index, 'productName', e.target.value)}
                                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.9rem' }}
                                                >
                                                    <option>Panzerotto</option>
                                                    <option>Focaccia</option>
                                                    <option>Calzone</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Variante</label>
                                                <input
                                                    type="text"
                                                    value={item.variant}
                                                    onChange={(e) => updateItem(index, 'variant', e.target.value)}
                                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.9rem' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Quantità</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                                    min="0.1"
                                                    step="0.1"
                                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.9rem' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Unità</label>
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.9rem' }}
                                                >
                                                    <option value="pz">pz</option>
                                                    <option value="kg">kg</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                style={{ background: '#e74c3c', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
                                                title="Rimuovi prodotto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditingOrder(null)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                                Annulla
                            </button>
                            <button onClick={saveOrderChanges} className="btn-primary" style={{ padding: '10px 20px' }}>
                                💾 Salva Modifiche
                            </button>
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
                                <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => printOrder(order)}
                                        style={{ background: 'none', border: '1px solid white', color: 'white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                                        title="Stampa ordine"
                                    >
                                        🖨
                                    </button>
                                    <button
                                        onClick={() => openEditModal(order)}
                                        className="btn-primary"
                                        style={{ padding: '5px 10px', fontSize: '0.9rem', background: '#3498db' }}
                                        title="Modifica ordine"
                                    >
                                        ✏️ Modifica
                                    </button>
                                    <button
                                        onClick={() => markCompleted(order.id)}
                                        className="btn-primary"
                                        style={{ padding: '5px 10px', fontSize: '0.9rem', background: '#2ecc71' }}
                                        title="Segna come completato"
                                    >
                                        ✓ Completato
                                    </button>
                                    <button
                                        onClick={() => deleteOrder(order.id)}
                                        className="btn-primary"
                                        style={{ padding: '5px 10px', fontSize: '0.9rem', background: '#e74c3c' }}
                                        title="Elimina ordine"
                                    >
                                        🗑️ Elimina
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
