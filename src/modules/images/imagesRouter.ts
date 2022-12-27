import express from "express";
import { addImage, getImage, getImagesList } from "./imagesController";

const router = express.Router();

router.get("/", getImagesList);

router.get("/:id", getImage);

router.post("/", addImage);

export default router;
