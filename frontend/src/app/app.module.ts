import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { BlogDetailComponent } from './blog/blog-detail.component';
import { BlogComponent } from './blog/blog.component';
import { DisqusComponent } from './blog/disqus.component';
import { CardComponent } from './card/card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PhotosComponent } from './photos/photos.component';
import { ProjectsComponent } from './projects/projects.component';

import { ViewService } from './shared/view.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    BlogComponent,
    DisqusComponent,
    BlogDetailComponent,
    PhotosComponent,
    CardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    TransferHttpCacheModule,
    AppRoutingModule
  ],
  providers: [ViewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
