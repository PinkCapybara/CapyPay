/*
  Warnings:

  - You are about to drop the column `provider` on the `OffRampTransaction` table. All the data in the column will be lost.
  - Added the required column `vpa` to the `OffRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OffRampTransaction" DROP COLUMN "provider",
ADD COLUMN     "vpa" TEXT NOT NULL;
