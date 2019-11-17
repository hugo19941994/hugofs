const express = require("express");
const compression = require("compression");

import { photo_router, prepare_photos } from "./photos";
import { post_router } from "./posts";

const app = express();
app.use(compression()); // TODO: brotli

(async () => {
  await prepare_photos()
  app.use("/", photo_router);
})()

app.use("/", post_router);

app.listen(process.env.PORT || 3060);
