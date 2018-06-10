const { readdir, readFile, lstat } = require("fs").promises;
const sharp = require("sharp");
import { extname } from "path";
import { Router } from "express";
const ExifImage = require("exif").ExifImage;

let images: { [s: string]: Images } = {};
export let photo_router = Router();
prepare_photos();

// Single image
class Image {
  // Photo name
  name: string = "";

  // Thumbnails
  webp: any;
  jpgp: any;
}

// Image collection
class Images {
  // List of images
  images: { [s: string]: Image } = {};

  // Location of heatmaps
  heatmap: any[] = [];

  // Center of map
  location: Object = "";

  // Collection name
  folder: string = "";
}

async function fillImages(dir, folder) {
  // All jpg files
  const img_in_folder: string[] = (await readdir(`${dir}${folder}`)).filter(
    f => extname(f).toLowerCase() === ".jpg"
  );

  for (const img_name of img_in_folder) {
    let image = new Image();

    // Resize image
    const img_resized = sharp(`${dir}${folder}/${img_name}`).resize(500);

    image.name = img_name;
    image.webp = await img_resized.webp().toBuffer();
    image.jpgp = await img_resized.jpeg({ progressive: true }).toBuffer();

    images[folder].images[image.name] = image;
  }
}

function sumGeo(geoArr) {
  return geoArr[0] + geoArr[1] / 60 + geoArr[2] / 3600;
}

async function getEXIF(filePath) {
  return new Promise((resolve, reject) => {
    ExifImage(filePath, (err, data) => {
      if (err) reject(err.message);
      else resolve(data);
    });
  });
}

async function fillMetadata(dir, folder) {
  // All jpg files
  const img_in_folder: string[] = (await readdir(`${dir}${folder}`)).filter(
    f => extname(f).toLowerCase() === ".jpg"
  );

  // Extract GPS coords from exif
  for (const img_name of img_in_folder) {
    const exifData: any = await getEXIF(`${dir}${folder}/${img_name}`);
    if (exifData.gps.GPSLatitude !== undefined) {
      images[folder].heatmap.push({
        lat: sumGeo(exifData.gps.GPSLatitude),
        lon: sumGeo(exifData.gps.GPSLongitude)
      });
    }
  }

  // latitude and longitude average (simple average because locations are near each other)
  // TODO: More accurate average which takes into account curvature of earth?
  let lon =
    images[folder].heatmap.reduce((a, b) => a + b.lon, 0) /
    images[folder].heatmap.length;
  let lat =
    images[folder].heatmap.reduce((a, b) => a + b.lat, 0) /
    images[folder].heatmap.length;

  images[folder].location = { lat, lon };
}

export async function prepare_photos() {
  const dir = `${__dirname}/photos/`;
  const folders = await readdir(dir);

  for (let folder of folders) {
    // Filter non folders
    const stats = await lstat(`${dir}${folder}`);
    if (!stats.isDirectory()) {
      continue;
    }

    images[folder] = new Images();
    Promise.all([fillMetadata(dir, folder), fillImages(dir, folder)]);
  }
}

// Send metadata
photo_router.get("/api/photos", (req, res, next) => {
  let r: object[] = [];

  for (const folder in images) {
    r.push({
      folder: folder,
      heatmap: images[folder]["heatmap"],
      images: Object.keys(images[folder]["images"]),
      loc: images[folder]["location"]
    });
  }

  res.json(r);
});

// Send a web/progressive JPG thumbnail
photo_router.get("/api/photo/:folder/:id", (req, res, next) => {
  // Image path
  const img: Image = images[req.params.folder]["images"][req.params.id];

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
photo_router.get("/api/photo-original/:folder/:id", (req, res, next) => {
  res.sendFile(`${__dirname}/photos/${req.params.folder}/${req.params.id}`);
});
