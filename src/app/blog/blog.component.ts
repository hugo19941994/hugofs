import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogDetailComponent } from './blog-detail.component';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'blog',
  styleUrls: ['./blog.component.css'],
  templateUrl: './blog.component.html'
})
export class BlogComponent {
  posts = [];

  constructor(private httpClient: HttpClient, private router: Router, public viewService: ViewService) {
    // Show list if the user is coming back to /blog
    this.httpClient.get<any>('/api/posts')
      .subscribe(
        data => { this.posts = data; }
      );
  }

  selectPost(id): void {
    this.viewService.view = false;
    const url = `/blog/${id.title}`.replace(/ /g, '_');
    this.router.navigate([url]);
  }
}
