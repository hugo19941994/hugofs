import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PhotosComponent } from './photos.component';
import { PhotosRoutingModule } from './photos-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PhotosRoutingModule
  ],
  declarations: [
    PhotosComponent
  ]
})
export class PhotosModule { }
