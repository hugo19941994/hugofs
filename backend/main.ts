const express = require("express");
const compression = require("compression");

import { photo_router } from "./photos";
import { post_router } from "./posts";

const app = express();
app.use(compression()); // TODO: brotli

app.use("/", post_router);
app.use("/", photo_router);

app.listen(process.env.PORT || 3060);
