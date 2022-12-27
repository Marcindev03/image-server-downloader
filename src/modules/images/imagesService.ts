import fs from "fs";
import path from "path";
import https from "https";
import { Queue } from "../queue/queue";
import { CustomPrismaClient } from "../database/prisma";

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

export class ImagesService extends Queue {
  private static instance: ImagesService;

  private constructor() {
    super();
  }

  public static getInstance(): ImagesService {
    if (!ImagesService.instance) {
      ImagesService.instance = new ImagesService();
    }

    return ImagesService.instance;
  }

  public async getImagesList() {
    const prisma = CustomPrismaClient.getInstance();

    const images = await prisma.image.findMany();

    return images;
  }

  public async getImageDetails(imageId: string) {
    const prisma = CustomPrismaClient.getInstance();

    return await prisma.image.findUnique({ where: { id: +imageId } });
  }

  public async pushImage(url: string) {
    const prisma = CustomPrismaClient.getInstance();

    const dir = path.resolve(__dirname, "..", "..", "static");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(path.join(__dirname, "..", "..", "static"));
    }

    const filename = `${Date.now()}.jpg`;

    const saveDir = path.resolve(dir, filename);

    const { id } = await prisma.image.create({
      data: {
        isDownloaded: false,
        sourceUrl: url,
        createdAt: new Date(),
        downloadUrl: saveDir,
      },
    });

    this.pushTask(() =>
      downloadImage(url, saveDir, async (downloadDate: string) => {
        await prisma.image.update({
          data: { isDownloaded: true, downloadedAt: downloadDate },
          where: {
            id,
          },
        });
      })
    );

    return id;
  }
}
