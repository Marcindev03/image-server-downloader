import { Request, Response, NextFunction } from "express";
import { fetchImagesList, fetchImageDetails, pushImage } from "./imagesService";

export const getImagesList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imagesList = await fetchImagesList();

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
  const { id } = req.params;

  try {
    const imageDetails = await fetchImageDetails(parseInt(id));

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
  const { url } = req.body;

  try {
    const imageId = await pushImage(url);

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
