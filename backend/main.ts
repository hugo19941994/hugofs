import { express } from 'express';
import { compression } from 'compression';

import { photoRouter } from "./photos";
import { postRouter } from "./posts";

const app = express();
app.use(compression()); // TODO: brotli

app.use("/", postRouter);
app.use("/", photoRouter);

app.listen(process.env.PORT || 3060);
