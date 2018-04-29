import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'photos',
  styleUrls: ['./photos.component.css'],
  templateUrl: './photos.component.html'
})

export class PhotosComponent {
  photos = [];

  // TODO: Progressive loading
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<number>('/photosApi/photos/')
      .subscribe(max => {
        for (let i = 0; i < max; ++i) this.photos.push({
          source: `/photosApi/photo/${i}`,
          url: `/photosApi/bigphoto/${i}`
        });
      });
  }
}
