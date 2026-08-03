-- CreateTable
CREATE TABLE "SemanticMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SemanticMemory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SemanticMemory" ADD CONSTRAINT "SemanticMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
