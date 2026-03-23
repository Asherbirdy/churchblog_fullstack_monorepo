/*
  Warnings:

  - Added the required column `description` to the `ChatCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatCard" ADD COLUMN     "description" TEXT NOT NULL;
