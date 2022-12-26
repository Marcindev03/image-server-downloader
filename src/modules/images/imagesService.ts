import fs from "fs";
import path from "path";
import https from "https";
import { Queue } from "../queue/queue";
import { Image, ImageInput } from "../../types/image";

const downloadImage = async (
  url: string,
  dir: string,
  callback: (downloadDate: string) => void
) => {
  const filePipe = fs.createWriteStream(dir);

  https.get(url, async (res) => {
    res.pipe(filePipe);
    callback(new Date().toISOString());
  });
};

export class ImagesService extends Queue {
  private static instance: ImagesService;
  private images: Image[] = [];

  private constructor() {
    super();
  }

  public static getInstance(): ImagesService {
    if (!ImagesService.instance) {
      ImagesService.instance = new ImagesService();
    }

    return ImagesService.instance;
  }

  public getImagesList() {
    return this.images;
  }

  public getImageDetails(imageId: string) {
    return this.images.find(({ id }) => id === imageId);
  }

  public pushImage(url: string) {
    const imageId = Date.now().toString();

    const dir = path.resolve(__dirname, "..", "..", "static");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(path.join(__dirname, "..", "..", "static"));
    }

    const filename = `${Date.now()}.jpg`;

    const saveDir = path.resolve(dir, filename);

    this.pushTask(() =>
      downloadImage(url, saveDir, (downloadDate: string) =>
        this.updateImage(imageId, {
          isDownloaded: true,
          downloadedAt: downloadDate,
        })
      )
    );

    this.images.push({
      id: imageId,
      sourceUrl: url,
      downloadUrl: `localhost:8000/public/${filename}`,
      createdAt: new Date().toISOString(),
      downloadedAt: null,
      isDownloaded: false,
    });

    return imageId;
  }

  private updateImage(imageId: string, newImage: ImageInput) {
    const imageIndex = this.images.findIndex((image) => image.id === imageId);
    const oldImage = this.images[imageIndex];

    this.images[imageIndex] = {
      ...oldImage,
      ...newImage,
    };
  }
}
