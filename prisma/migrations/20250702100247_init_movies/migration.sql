-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "movieName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_movieName_category_key" ON "movies"("movieName", "category");
