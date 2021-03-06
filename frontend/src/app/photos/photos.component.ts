import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Inject,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import mapStyle from './map_style.json';

declare let google: any;

@Component({
  selector: 'app-photos',
  styleUrls: ['./photos.component.css'],
  templateUrl: './photos.component.html'
})
export class PhotosComponent implements AfterViewInit {
  @ViewChildren('photo') photoDiv: QueryList<any>;
  photos = [];

  // TODO: Progressive loading
  constructor(private readonly httpClient: HttpClient, private readonly renderer: Renderer2) {
    // Load photo data
    this.httpClient
      .get<Array<any>>('/api/photos/')
      .subscribe(res => (this.photos = res));
  }

  // Load maps after the photo div has finished rendering
  ngAfterViewInit(): void {
    this.photoDiv.changes.subscribe(() => {
      for (const collection of this.photos) { this.prepareMap(collection); }
    });
  }

  // Create a map for each collection
  prepareMap(collection): void {
    const mapProp = {
      center: new google.maps.LatLng(collection.loc.lat, collection.loc.lon),
      zoom: 5, // TODO: Use bounds to calculate zoom
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'none' as any,
      zoomControl: false,
      disableDefaultUI: true,
      backgroundColor: '#202020',
      draggableCursor: 'default'
    };
    const styledMapType = new google.maps.StyledMapType(mapStyle, {
      name: 'Styled Map'
    });
    const gmapElement = document.getElementById(`gmap${collection.folder}`);
    const map = new google.maps.Map(gmapElement, mapProp);
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    const heatmapData = [];
    for (const heat of collection.heatmap) {
      heatmapData.push(new google.maps.LatLng(heat.lat, heat.lon));
    }

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      radius: 15
    });
    heatmap.setMap(map);
  }
}
