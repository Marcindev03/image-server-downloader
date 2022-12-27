import { Request, Response, NextFunction } from "express";
import { ImagesService } from "./imagesService";

export const getImagesList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagesService = ImagesService.getInstance();

  try {
    const imagesList = await imagesService.getImagesList();

    res.json({
      imagesList,
    });
  } catch (err) {
    res.status(500);
    res.json({
      error: err,
    });
  }
};

export const getImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagesService = ImagesService.getInstance();
  const { id } = req.params;

  try {
    const imageDetails = await imagesService.getImageDetails(id);

    if (!imageDetails) {
      res.status(404);
      res.json({
        message: "Not found",
      });
    }

    res.json(imageDetails);
  } catch (err) {
    res.status(500);
    res.json({
      error: err,
    });
  }
};

export const addImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imagesService = ImagesService.getInstance();
  const { url } = req.body;

  try {
    const imageId = await imagesService.pushImage(url);

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
