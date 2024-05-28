-- CreateEnum
CREATE TYPE "BloodDonate" AS ENUM ('Yes', 'no');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bloodDonate" "BloodDonate" DEFAULT 'no';
