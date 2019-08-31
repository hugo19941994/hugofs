import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { TransferHttpCacheModule } from "@nguniversal/common";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";

import { BlogDetailComponent } from "./blog/blog-detail.component";
import { BlogComponent } from "./blog/blog.component";
import { CardComponent } from "./card/card.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { PhotosComponent } from "./photos/photos.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ViewService } from "./shared/view.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    BlogComponent,
    BlogDetailComponent,
    PhotosComponent,
    CardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "my-app" }),
    HttpClientModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "home", component: HomeComponent, pathMatch: "full" },
      { path: "projects", component: ProjectsComponent, pathMatch: "full" },
      { path: "photos", component: PhotosComponent, pathMatch: "full" },
      {
        path: "blog",
        component: BlogComponent,
        children: [{ path: ":id", component: BlogDetailComponent }]
      }
    ]),
    TransferHttpCacheModule
  ],
  providers: [ViewService],
  bootstrap: [AppComponent]
})
export class AppModule {}
