import { Request, Response, NextFunction } from "express";
import { URL_REGEX } from "../../utils/helpers";
import { fetchImagesList, fetchImageDetails, pushImage } from "./imagesService";

export const getImagesList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page } = req.query;

  try {
    const imagesList = await fetchImagesList(parseFloat(page as string));

    if (+(page as string) > imagesList.totalPages) {
      res.status(404);
      res.json({
        message: "Page doesn't exist",
      });
    }

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
        message: "Image not found",
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
  const { url } = req.body as { url: string };

  if (!URL_REGEX.test(url)) {
    res.status(404);
    res.json({
      message: "Bad url adress",
    });
    return;
  }
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
