import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

@Component({
  selector: 'photos',
  styleUrls: ['./photos.component.css'],
  templateUrl: './photos.component.html'
})

export class PhotosComponent {
  photos = [];
  maxImage = -1;
  max = 0;

  constructor(private httpClient: HttpClient, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
    // Doesn't work on server. Must use full address
    this.httpClient.get<number>('/photosApi/photos/')
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

      this.httpClient.get<any>(`/photosApi/photo/${this.maxImage}`)
        .subscribe(data => {
          this.photos.push(data);
          this.changeDetectorRef.detectChanges();
        });
    }
  }
}
