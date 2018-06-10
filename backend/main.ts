const express = require("express");
const compression = require("compression");

import { post_router } from "./posts";
import { photo_router } from "./photos";

const app = express();
app.use(compression()); // TODO: brotli

app.use("/", photo_router);
app.use("/", post_router);

app.listen(process.env.PORT || 3060);
