import fs from "fs";
import path from "path";
import https from "https";
import { Queue } from "../queue/queue";

const downloadImage = async (url: string, dir: string) => {
  const filePipe = fs.createWriteStream(dir);

  https.get(url, (res) => res.pipe(filePipe));
};

type Image = {
  id: string;
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

    const dir = path.resolve(__dirname, "..", "..", "static", "images");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(path.join(__dirname, "..", "..", "static"));
      fs.mkdirSync(path.join(__dirname, "..", "..", "static", "images"));
    }

    const filename = path.resolve(dir, `${Date.now()}.jpg`);

    this.pushTask(() => downloadImage(url, filename));
    this.images.push({ id: imageId });

    return imageId;
  }
}
