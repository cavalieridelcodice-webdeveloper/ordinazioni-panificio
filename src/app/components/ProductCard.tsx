'use client';

import { useState } from 'react';
import { Product } from '@/lib/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
    onAdd: (item: any) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    const [variant, setVariant] = useState(product.variants[0].name);
    const [unit, setUnit] = useState<'pezzi' | 'kg'>('pezzi');
    const [quantity, setQuantity] = useState<string>('');

    const handleAdd = () => {
        const qty = parseFloat(quantity);
        if (!qty || qty <= 0) return;

        onAdd({
            productId: product.id,
            productName: product.name,
            variant,
            quantity: qty,
            unit,
            price: unit === 'pezzi' ? (product.pricePerUnit || 0) * qty : (product.pricePerKg || 0) * qty
        });
        setQuantity('');
    };

    return (
        <div className={`glass-panel ${styles.card}`}>
            <h3 className={styles.title}>{product.name}</h3>

            <div className={styles.field}>
                <label>Variante</label>
                <select value={variant} onChange={(e) => setVariant(e.target.value)}>
                    {product.variants.map((v) => (
                        <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label>Misura</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value as 'pezzi' | 'kg')}>
                        <option value="pezzi">A Pezzi </option>
                        <option value="kg">A Kg</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Quantità ({unit})</label>
                    <input
                        type="number"
                        step={unit === 'kg' ? '0.1' : '1'}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder={unit === 'kg' ? 'es. 0.5' : 'es. 2'}
                    />
                </div>
            </div>

            <button className="btn-primary" onClick={handleAdd} disabled={!quantity}>
                Aggiungi all'ordine
            </button>
        </div>
    );
}
