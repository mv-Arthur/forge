-- CreateTable
CREATE TABLE "Promo" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "priceNote" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "projectsHref" TEXT NOT NULL,
    "terms" TEXT[],
    "includes" TEXT[],
    "details" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promo_slug_key" ON "Promo"("slug");
