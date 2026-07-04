-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FaqItem" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Certificate_order_idx" ON "Certificate"("order");

-- CreateIndex
CREATE INDEX "FaqItem_order_idx" ON "FaqItem"("order");

-- CreateIndex
CREATE INDEX "Partner_order_idx" ON "Partner"("order");

-- CreateIndex
CREATE INDEX "Review_order_idx" ON "Review"("order");

-- CreateIndex
CREATE INDEX "Vacancy_order_idx" ON "Vacancy"("order");
