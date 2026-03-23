-- AlterTable
ALTER TABLE "ChatCard" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ChatTopic" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;
