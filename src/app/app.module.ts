import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ProjectsComponent } from './projects/projects.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog/blog-detail.component';
import { PhotosComponent } from './photos/photos.component';
import { ViewService } from './shared/view.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    BlogComponent,
    BlogDetailComponent,
    PhotosComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'home', component: HomeComponent, pathMatch: 'full'},
      { path: 'projects', component: ProjectsComponent, pathMatch: 'full'},
      { path: 'photos', component: PhotosComponent, pathMatch: 'full'},
      { path: 'blog', component: BlogComponent, children: [{ path: ':id', component: BlogDetailComponent}]}
    ]),
    TransferHttpCacheModule
  ],
  providers: [
    ViewService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
