import fs from "fs";
import path from "path";
import https from "https";
import { Queue } from "../queue/queue";

const downloadImage = async (url: string, dir: string) => {
  const filePipe = fs.createWriteStream(dir);

  https.get(url, (res) => res.pipe(filePipe));
};

export const pushImageToDownloadQueue = async (url: string) => {
  const imageId = Date.now();

  const dir = path.resolve(
    __dirname,
    "..",
    "..",
    "static",
    "images",
    `${imageId}.jpg`
  );
  const queue = Queue.getInstance();

  queue.pushTask(() => downloadImage(url, dir));

  return imageId;
};
