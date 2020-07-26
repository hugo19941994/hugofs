import Image from './image';

// Image collection
export default class Images {
  // List of images
  images: { [s: string]: Image } = {};

  // Location of heatmaps
  heatmap: any[] = [];

  // Center of map
  location: object = {lat: 0, lon: 0};

  // Collection name
  folder = "";
}

