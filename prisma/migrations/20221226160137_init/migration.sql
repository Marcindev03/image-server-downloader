-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "downloadedAt" TIMESTAMP(3) NOT NULL,
    "isDownload" BOOLEAN NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
