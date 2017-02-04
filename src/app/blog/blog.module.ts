import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogDetailComponent } from './blog-detail.component';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    SharedModule,
    BlogRoutingModule,
    HttpModule
  ],
  declarations: [
    BlogComponent,
    BlogDetailComponent
  ]
})
export class BlogModule { }
