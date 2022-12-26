import express from "express";
import { addImage } from "./imagesController";

const router = express.Router();

router.post("/", addImage);

export default router;
