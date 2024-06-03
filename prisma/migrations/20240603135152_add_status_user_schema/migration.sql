-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVATE', 'DEACTIVATE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" DEFAULT 'ACTIVATE';
