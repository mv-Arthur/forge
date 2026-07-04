-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'editor');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'editor';
