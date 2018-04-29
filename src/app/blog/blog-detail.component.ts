import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'blog-detail',
  styleUrls: ['./blog-detail.component.css'],
  templateUrl: './blog-detail.component.html'
})
export class BlogDetailComponent {
  data: any = [];
  id: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router, public viewService: ViewService) {
    this.route.params.subscribe(params => {
      this.selectPost(params['id']);
    });

    router.events.subscribe((val: Event) => {
      if (val instanceof NavigationEnd) {
        if (val.url.match('\/blog\/')) viewService.view = false;
      } else viewService.view = true;
    });
  }

  selectPost(id: string): void {
    this.httpClient.get(`/api/post/${id}`)
    .subscribe(
      data => {
        this.data = data;
      }
    );
  }

  back(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
