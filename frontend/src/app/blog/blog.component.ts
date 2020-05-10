import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ViewService } from '../shared/view.service';
import { BlogDetailComponent } from './blog-detail.component';

@Component({
  selector: 'app-blog',
  styleUrls: ['./blog.component.css'],
  templateUrl: './blog.component.html'
})
export class BlogComponent {
  public posts: Array<Post>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    public viewService: ViewService
  ) {
    // Show list if the user is coming back to /blog
    this.httpClient.get<Array<Post>>('/api/posts').subscribe(data => {
      this.posts = data;
    });
  }

  selectPost(post: Post): void {
    this.viewService.view = false;
    const url = `/blog/${post.title}`.replace(/ /g, '_');
    this.router.navigate([url])
    .catch((err): void => {
      console.error(err);
    });
  }
}

interface Post {
  title: string;
  date: string;
}
