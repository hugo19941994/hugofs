import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BlogDetailComponent } from './blog-detail.component';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'blog',
  styleUrls: ['./blog.component.css'],
  templateUrl: './blog.component.html'
})
export class BlogComponent {
  posts = {}
  showList = true;

  constructor(private http: Http, private router: Router) {
    // Show list if the user is coming back to /blog
    router.events.subscribe((val) => {
      if (val.url == '/blog') {
        this.showList = true;
      }
      else {
        this.showList = false;
      }
    });

    this.showList = true;
    let res = {}
    this.http.get('/api/posts')
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {this.posts = data}
      )
  }

  selectPost(id) {
    this.showList = false;
    this.router.navigate(['/blog/'+ id])
  }
}
