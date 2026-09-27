-- CreateTable
CREATE TABLE "PageSlot" (
    "page" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "mediaId" TEXT,

    CONSTRAINT "PageSlot_pkey" PRIMARY KEY ("page","slot")
);

-- CreateIndex
CREATE INDEX "PageSlot_mediaId_idx" ON "PageSlot"("mediaId");

-- AddForeignKey
ALTER TABLE "PageSlot" ADD CONSTRAINT "PageSlot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
