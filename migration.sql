-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "items" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "customerName" TEXT NOT NULL DEFAULT 'Cliente',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'In attesa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

