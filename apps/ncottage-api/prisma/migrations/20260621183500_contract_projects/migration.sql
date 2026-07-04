-- AlterTable
ALTER TABLE "Project" DROP COLUMN "floorPlans",
DROP COLUMN "images",
DROP COLUMN "options",
DROP COLUMN "packages",
DROP COLUMN "relatedObjectIds",
DROP COLUMN "specs",
ALTER COLUMN "specsBuildTime" SET NOT NULL,
ALTER COLUMN "specsDimensions" SET NOT NULL,
ALTER COLUMN "specsFoundation" SET NOT NULL,
ALTER COLUMN "specsRoofType" SET NOT NULL,
ALTER COLUMN "specsWallMaterial" SET NOT NULL;

