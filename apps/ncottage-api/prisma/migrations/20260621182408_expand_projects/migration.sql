-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "specsBuildTime" TEXT,
ADD COLUMN     "specsDimensions" TEXT,
ADD COLUMN     "specsFoundation" TEXT,
ADD COLUMN     "specsRoofType" TEXT,
ADD COLUMN     "specsWallMaterial" TEXT,
ALTER COLUMN "specs" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaId" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFloorPlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "mediaId" TEXT,
    "area" INTEGER,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectFloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFloorPlanRoom" (
    "id" TEXT NOT NULL,
    "floorPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectFloorPlanRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPackage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "tagline" TEXT,
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPackageInclude" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectPackageInclude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectOption" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "note" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRelation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "relatedSlug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProjectRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFloorPlan_projectId_idx" ON "ProjectFloorPlan"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFloorPlanRoom_floorPlanId_idx" ON "ProjectFloorPlanRoom"("floorPlanId");

-- CreateIndex
CREATE INDEX "ProjectPackage_projectId_idx" ON "ProjectPackage"("projectId");

-- CreateIndex
CREATE INDEX "ProjectPackageInclude_packageId_idx" ON "ProjectPackageInclude"("packageId");

-- CreateIndex
CREATE INDEX "ProjectOption_projectId_idx" ON "ProjectOption"("projectId");

-- CreateIndex
CREATE INDEX "ProjectRelation_projectId_idx" ON "ProjectRelation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRelation_projectId_relatedSlug_key" ON "ProjectRelation"("projectId", "relatedSlug");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFloorPlan" ADD CONSTRAINT "ProjectFloorPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFloorPlanRoom" ADD CONSTRAINT "ProjectFloorPlanRoom_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES "ProjectFloorPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPackage" ADD CONSTRAINT "ProjectPackage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPackageInclude" ADD CONSTRAINT "ProjectPackageInclude_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ProjectPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOption" ADD CONSTRAINT "ProjectOption_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRelation" ADD CONSTRAINT "ProjectRelation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
