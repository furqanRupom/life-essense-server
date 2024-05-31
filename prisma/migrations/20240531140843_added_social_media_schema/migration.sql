-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emergencyPhoneNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "SocialMediaMethods" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "whatsApp" TEXT,

    CONSTRAINT "SocialMediaMethods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaMethods_userId_key" ON "SocialMediaMethods"("userId");

-- AddForeignKey
ALTER TABLE "SocialMediaMethods" ADD CONSTRAINT "SocialMediaMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
