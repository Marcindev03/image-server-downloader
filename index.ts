import express from "express";

const app = express();

app.get("/", (req, res) => res.send("hello world"));

const port = 8000;

app.listen(port, () => console.log(`App is running on port ${port}`));
