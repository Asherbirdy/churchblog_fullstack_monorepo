-- CreateTable
CREATE TABLE "ChatTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "chatTopicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatCard" ADD CONSTRAINT "ChatCard_chatTopicId_fkey" FOREIGN KEY ("chatTopicId") REFERENCES "ChatTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
