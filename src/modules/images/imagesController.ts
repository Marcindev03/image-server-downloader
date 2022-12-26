import { Request, Response, NextFunction } from "express";
import { pushImageToDownloadQueue } from "./imagesService";

export const addImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.body;

  try {
    const imageId = await pushImageToDownloadQueue(url);

    res.json({
      url: `localhost:8000/images/${imageId}`,
    });
  } catch (err) {
    res.status(500);
    res.json({
      error: err,
    });
  }
};
