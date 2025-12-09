export type ProductVariant = {
    name: string;
}

export type Product = {
    id: string;
    name: string;
    variants: ProductVariant[];
    pricePerUnit?: number; // Price per piece
    pricePerKg?: number;   // Price per Kg
    hasQuantityInput: boolean;
}

export const PRODUCTS: Product[] = [
    {
        id: 'panzerotto',
        name: 'Panzerotto',
        variants: [
            { name: 'Mozzarella e Pomodoro' },
            { name: 'Carne' },
            { name: 'Rape' }
        ],
        pricePerUnit: 2.50,
        hasQuantityInput: true
    },
    {
        id: 'focaccia',
        name: 'Focaccia',
        variants: [
            { name: 'Pomodori' },
            { name: 'Bianca' },
            { name: 'Patate' }
        ],
        pricePerKg: 12.00, // Usually sold by weight, but pieces also common. Let's support both if needed, or stick to requirements.
        // Requirement says: "A Pezzi" AND "A Kg" for EVERY product selected.
        // "Per ogni prodotto selezionato, l'utente deve poter scegliere la quantità in due modalità distinte."
        // So Focaccia can be by piece or kg.
        // Panzerotto by Kg is weird, but I must follow requirement or adapt.
        // Usually Panzerotto is pieces.
        // I will support both inputs for all, but maybe show a warning or just calculate price.
        // I'll set defaults.
        pricePerUnit: 2.00,
        hasQuantityInput: true
    },
    {
        id: 'calzone',
        name: 'Calzone',
        variants: [
            { name: 'Carne' },
            { name: 'Rape' },
            { name: 'Prosciutto Cotto' }
        ],
        pricePerUnit: 3.50,
        pricePerKg: 15.00,
        hasQuantityInput: true
    }
];
