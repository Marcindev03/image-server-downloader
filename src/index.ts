import express from "express";

import imagesRouter from "./modules/images/imagesRouter";

const app = express();

app.use(express.json());

app.use("/images", imagesRouter);

const port = 8000;

app.listen(port, () => console.log(`App is running on port ${port}`));
