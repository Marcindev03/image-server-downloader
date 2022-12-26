import express from "express";
import compression from "compression";

import imagesRouter from "./modules/images/imagesRouter";

const app = express();

app.use(express.json());
app.use(compression());

app.use("/public", express.static("dist/static"));

app.use("/images", imagesRouter);

const port = 8000;

app.listen(port, () => console.log(`App is running on port ${port}`));
