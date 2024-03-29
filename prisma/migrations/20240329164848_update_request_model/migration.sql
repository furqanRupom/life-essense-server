/*
  Warnings:

  - The `requestStatus` column on the `requestes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "requestes" DROP COLUMN "requestStatus",
ADD COLUMN     "requestStatus" "RequestStatus" NOT NULL DEFAULT 'PENDING';
