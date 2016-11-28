import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeModule } from './+home/home.module';
import { ProjectsModule } from './projects/projects.module';
import { BlogModule } from './blog/blog.module';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, XLargeDirective } from './app.component';


@NgModule({
  declarations: [ AppComponent, XLargeDirective ],
  imports: [
    SharedModule,
    HomeModule,
    ProjectsModule,
    BlogModule,
    AppRoutingModule
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
