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
            { name: 'Mozzarella senza lattosio e pomodoro' }, // Nuova
            { name: 'Carne' },
            { name: 'Carne e Mozzarella senza lattosio' },    // Nuova
            { name: 'Rape' },
            { name: 'Rape con mozzarella senza lattosio' },// Nuova
            { name: 'Solo rape' },   // Nuova
            { name: 'Cipolla caramellata con mozzarella' }  // Nuova
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
            { name: 'Carne e Mozzarella' },
            { name: 'Rape e Mozzarella' },
            { name: 'Prosciutto Cotto e Mozzarella' }
        ],
        pricePerUnit: 3.50,
        pricePerKg: 15.00,
        hasQuantityInput: true
    },
    {
        id: 'panini', // Nuova Categoria
        name: 'Panini',
        variants: [
            { name: 'Rosette' },
            { name: 'Tartaruche' },
            { name: 'Olio' },
            { name: 'Arabi' },
            { name: 'Sandwich lunghi' },
            { name: 'Sandwich tondi' },
            { name: 'Mignon' }
        ],
        pricePerUnit: 1.00, // Imposta un prezzo predefinito
        hasQuantityInput: true
    },
    {
        id: 'pane', // Nuova Categoria
        name: 'Pane',
        variants: [
            { name: 'Pane tondo' },
            { name: 'Pane a filone' },
            { name: 'Pane di semola' },
            { name: 'Pane Integrale' }
        ],
        pricePerKg: 4.50, // Il pane solitamente va a Kg
        hasQuantityInput: true
    },
    {
        id: 'frittura-mista', // Nuova Categoria
        name: 'Frittura Mista',
        variants: [
            { name: 'Piccola' },
            { name: 'Media' },
            { name: 'Grande' }
        ],
        pricePerUnit: 5.00, 
        hasQuantityInput: true
    },
];
