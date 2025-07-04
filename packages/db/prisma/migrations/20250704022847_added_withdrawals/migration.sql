/*
  Warnings:

  - Changed the type of `status` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('Success', 'Failure', 'Processing');

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "status",
ADD COLUMN     "status" "TxnStatus" NOT NULL;

-- DropEnum
DROP TYPE "OnRampStatus";

-- CreateTable
CREATE TABLE "OffRampTransaction" (
    "id" SERIAL NOT NULL,
    "status" "TxnStatus" NOT NULL,
    "token" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OffRampTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OffRampTransaction_token_key" ON "OffRampTransaction"("token");

-- AddForeignKey
ALTER TABLE "OffRampTransaction" ADD CONSTRAINT "OffRampTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
