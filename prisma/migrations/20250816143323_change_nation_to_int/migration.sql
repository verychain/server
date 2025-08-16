/*
  Warnings:

  - Changed the type of `nation` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "nation",
ADD COLUMN     "nation" INTEGER NOT NULL;
