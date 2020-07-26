import { readdir, readFile, lstat } from "fs/promises";
import sharp from "sharp";
import { Router } from "express";
import { extname } from "path";
import ExifImage from "exif";
import getRawBody from 'raw-body';

import { Storage, File } from '@google-cloud/storage';
const storage = new Storage();
const bucket = storage.bucket('photos-hugofs');

import Image from './image';
import Images from './images';

const images: { [s: string]: Images } = {};
export let photoRouter = Router();

let FINISHED = false;

prepare_photos()


async function fillImages(collection, files) {
  for (const file of files) {
    const image = new Image();
    const buffer = await getRawBody(file.createReadStream());

    // Resize image
    const imgResized = sharp(buffer).resize(500);

    image.name = file.name.split('/')[1];
    image.webp = await imgResized.webp().toBuffer();
    image.jpgp = await imgResized.jpeg({ progressive: true }).toBuffer();
    image.file = file;

    images[collection].images[image.name] = image;
  }
}

function sumGeo(geoArr) {
  return geoArr[0] + geoArr[1] / 60 + geoArr[2] / 3600;
}

async function getEXIF(file) {
  const buffer = await getRawBody(file.createReadStream());

  return new Promise((resolve, reject) => {
    ExifImage(buffer, (err, data) => {
      if (err) { reject(err.message); }
      else { resolve(data); }
    });
  });
}

async function fillMetadata(collection, files) {
  // Extract GPS coords from exif
  for (const file of files) {
    const exifData: any = await getEXIF(file);
    if (exifData.gps.GPSLatitude !== undefined) {
      images[collection].heatmap.push({
        lat: sumGeo(exifData.gps.GPSLatitude),
        lon: sumGeo(exifData.gps.GPSLongitude)
      });
    }
  }

  // latitude and longitude average (simple average because locations are near each other)
  // TODO: More accurate average which takes into account curvature of earth?
  const lon =
    images[collection].heatmap.reduce((a, b) => a + b.lon, 0) /
    images[collection].heatmap.length;
  const lat =
    images[collection].heatmap.reduce((a, b) => a + b.lat, 0) /
    images[collection].heatmap.length;

  images[collection].location = { lat, lon };
}

async function prepare_photos() {
  const [allFiles] = await bucket.getFiles();

  const collections: any = {};
  for (const file of allFiles) {
    const [folder] = file.metadata.name.split('/')
    if (!collections[folder]) {
      collections[folder] = [];
    }
    collections[folder].push(file);
  }

  for (const collection of Object.keys(collections)) {
    images[collection] = new Images();
    await Promise.all([
      fillMetadata(collection, collections[collection]),
      fillImages(collection, collections[collection])
    ]);
  }

  // Lloading finished, can now serve the API
  FINISHED = true;
}

// Send metadata
photoRouter.get("/api/photos", async (req, res, next) => {
  while (!FINISHED) {
    await timeout(1000);
  }

  const reply: object[] = [];

  for (const folder in images) {
    if (images.hasOwnProperty(folder)) {
      reply.push({
        folder,
        heatmap: images[folder].heatmap,
        images: Object.keys(images[folder].images),
        loc: images[folder].location
      });
    }
  }

  res.json(reply);
});

// Send a web/progressive JPG thumbnail
photoRouter.get("/api/photo/:folder/:id", async (req, res, next) => {
  while (!FINISHED) {
    await timeout(1000);
  }

  // Image path
  const img: Image = images[req.params.folder].images[req.params.id];

  // Send webp or progressive JPEG, depening on browser support
  if (req.get("accept").indexOf("image/webp") > -1) {
    res.type("image/webp");
    res.send(img.webp);
  } else {
    res.type("image/jpg");
    res.send(img.jpgp);
  }
});

// Send original photo
photoRouter.get("/api/photo-original/:folder/:id", async (req, res, next) => {
  while (!FINISHED) {
    await timeout(1000);
  }

  const img: Image = images[req.params.folder].images[req.params.id];

  const url = img.file.createReadStream().pipe(res);
});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
