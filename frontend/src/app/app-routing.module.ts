import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { BlogDetailComponent } from './blog/blog-detail.component';
import { BlogComponent } from './blog/blog.component';
import { PhotosComponent } from './photos/photos.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: 'projects', component: ProjectsComponent, pathMatch: 'full' },
      { path: 'photos', component: PhotosComponent, pathMatch: 'full' },
      {
        path: 'blog',
        component: BlogComponent,
        children: [{ path: ':id', component: BlogDetailComponent }]
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
