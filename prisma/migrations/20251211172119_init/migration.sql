-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "items" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "customerName" TEXT NOT NULL DEFAULT 'Cliente',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'In attesa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
