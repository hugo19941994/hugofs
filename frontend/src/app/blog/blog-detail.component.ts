import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { ViewService } from "../shared/view.service";
import { DisqusComponent } from "./disqus.component";

@Component({
  selector: "blog-detail",
  styleUrls: ["./blog-detail.component.css"],
  templateUrl: "./blog-detail.component.html",
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None // Used to center images
})
export class BlogDetailComponent {
  post: Post = {"title": "", "date": "", "text": ""};
  loadAPI: Promise<any>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public viewService: ViewService
  ) {
    this.route.params.subscribe(params => {
      this.selectPost(params.id);
    });

    router.events.subscribe((val: Event) => {
      if (val instanceof NavigationEnd) {
        if (val.url.match("/blog/")) { viewService.view = false };
      } else {
        viewService.view = true
      };
    });
  }

  selectPost(id: string): void {
    this.httpClient
      .get<Post>(`/api/post/${id}`)
      .subscribe(data => {
        this.post = data;
      });
  }

  back(): void {
    this.router.navigate(["../"], { relativeTo: this.route })
    .catch((err): void => {
      console.error(err);
    });
  }
}

interface Post {
  title: string;
  date: string;
  text: string;
}
