-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "highlights" TEXT[],
    "scopes" TEXT[],
    "stages" TEXT[],
    "advantages" TEXT[],
    "fitFor" TEXT[],
    "includes" TEXT[],
    "notIncluded" TEXT[],
    "priceFactors" TEXT[],
    "deliverables" TEXT[],
    "quickFacts" TEXT[],
    "detailPain" TEXT,
    "detailPromise" TEXT,
    "detailVariants" JSONB NOT NULL,
    "detailChecks" TEXT[],
    "detailNextStep" TEXT,
    "detailCta" TEXT,
    "relatedSlugs" TEXT[],
    "scenarioSlugs" TEXT[],
    "seoContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceScenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "questionLabel" TEXT NOT NULL,
    "pain" TEXT,
    "promise" TEXT,
    "outcome" TEXT,
    "cta" TEXT,
    "nextStep" TEXT NOT NULL,
    "serviceSlugs" TEXT[],
    "primaryServiceSlugs" TEXT[],
    "nextServiceSlugs" TEXT[],
    "optionalServiceSlugs" TEXT[],
    "planTitle" TEXT NOT NULL,
    "planResultLabel" TEXT NOT NULL,
    "planVisualTitle" TEXT NOT NULL,
    "planVisualCaption" TEXT NOT NULL,
    "planImage" TEXT NOT NULL,
    "planStartLabel" TEXT NOT NULL,
    "planStartText" TEXT,
    "planNextLabel" TEXT NOT NULL,
    "planNextText" TEXT NOT NULL,
    "planOptionalLabel" TEXT NOT NULL,
    "planOptionalText" TEXT NOT NULL,
    "planCtaText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceScenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_order_idx" ON "Service"("order");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceScenario_slug_key" ON "ServiceScenario"("slug");

-- CreateIndex
CREATE INDEX "ServiceScenario_order_idx" ON "ServiceScenario"("order");
