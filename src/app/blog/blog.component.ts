import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BlogDetailComponent } from './blog-detail.component';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'blog',
  styleUrls: ['./blog.component.css'],
  templateUrl: './blog.component.html'
})
export class BlogComponent {
  posts = []

  constructor(private http: Http, private router: Router, public viewService: ViewService) {
    // Show list if the user is coming back to /blog
    let res = {}
    this.http.get('/api/posts')
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {this.posts = data}
      )
  }

  selectPost(id) {
    this.viewService.view = false;
    this.router.navigate(['/blog/'+ id.title])
  }
}
