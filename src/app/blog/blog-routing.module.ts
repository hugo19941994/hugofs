import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'blog',
        component: BlogComponent,
        children: [
          { path: ':id',
            component: BlogDetailComponent
          }
        ]
      }
    ])
  ]
})
export class BlogRoutingModule { }
