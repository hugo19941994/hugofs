import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'photos',
  styleUrls: ['./photos.component.css'],
  templateUrl: './photos.component.html'
})

export class PhotosComponent {
  photos = [];
  maxImage = -1;
  max = 0;

  constructor(private http: Http, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    // Doesn't work on server. Must use full address
    this.http.get('/photosApi/photos/')
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.max = data;
          // Find a better way of not loading everything
          for (let i = 0; i < this.max; ++i) this.nextImage();
        }
      );
  }

  @HostListener('window:scroll', ['$event']) triggerCycle(event): void {
    if ((window.innerHeight + window.scrollY + 50) >= document.body.offsetHeight) this.nextImage();
  }

  nextImage(): void {
    if (this.max - 1 > this.maxImage) {
      this.maxImage++;

      this.http.get(`/photosApi/photo/${this.maxImage}`)
        .map((res: Response) => res.json())
        .subscribe(data => {
          this.photos.push(data);
          this.changeDetectorRef.detectChanges();
        });
    }
  }
}
