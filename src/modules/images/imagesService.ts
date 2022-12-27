import fs from "fs";
import path from "path";
import https from "https";
import { Queue } from "../queue/queue";
import { prisma } from "../database/prisma";
import { PAGE_SIZE } from "../../utils/helpers";

const downloadImage = async (
  url: string,
  dir: string,
  callback: (downloadDate: string) => Promise<void>
) => {
  const filePipe = fs.createWriteStream(dir);

  https.get(url, async (res) => {
    const stream = res.pipe(filePipe);

    stream.on("finish", async () => await callback(new Date().toISOString()));
  });
};

const saveImageToDb = async (url: string, filename: string) => {
  const downloadUrl = `${process.env.DOMAIN_NAME}/public/${filename}`;
  const { id } = await prisma.image.create({
    data: {
      isDownloaded: false,
      sourceUrl: url,
      createdAt: new Date(),
      downloadUrl,
    },
  });

  return id;
};

export const fetchImagesList = async (page: number) => {
  const [totalImages, images] = await prisma.$transaction([
    prisma.image.count(),
    prisma.image.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    totalPages: Math.floor(totalImages / PAGE_SIZE),
    images,
  };
};

export const fetchImageDetails = async (iamgeId: number) =>
  await prisma.image.findUnique({ where: { id: iamgeId } });

export const pushImage = async (url: string) => {
  const dir = path.resolve(__dirname, "..", "..", "static");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(__dirname, "..", "..", "static"));
  }

  const filename = `${Date.now()}.jpg`;
  const saveDir = path.resolve(dir, filename);

  const imageId = await saveImageToDb(url, filename);

  const queue = Queue.getInstance();

  queue.pushTask(() =>
    downloadImage(url, saveDir, async (downloadDate: string) => {
      await prisma.image.update({
        data: { isDownloaded: true, downloadedAt: downloadDate },
        where: {
          id: imageId,
        },
      });
    })
  );

  return imageId;
};
