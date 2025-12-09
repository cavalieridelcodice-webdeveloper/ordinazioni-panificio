-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "items" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "customerName" TEXT NOT NULL DEFAULT 'Cliente',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'In attesa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("createdAt", "id", "items", "notes", "pickupTime", "status", "totalPrice") SELECT "createdAt", "id", "items", "notes", "pickupTime", "status", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
