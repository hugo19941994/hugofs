import { File } from '@google-cloud/storage';

// Single image
export default class Image {
  // Photo name
  name = "";

  // Thumbnails
  webp: any;
  jpgp: any;

  // Original file
  file: File;
}


