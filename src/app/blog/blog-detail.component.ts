import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ViewService } from "../shared/view.service";

@Component({
  selector: "blog-detail",
  styleUrls: ["./blog-detail.component.css", "./isso.css"],
  templateUrl: "./blog-detail.component.html",
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None // Used to center images
})
export class BlogDetailComponent {
  post: Post = {} as Post;
  loadAPI: Promise<any>;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public viewService: ViewService
  ) {
    this.route.params.subscribe(params => {
      this.selectPost(params["id"]);
    });

    router.events.subscribe((val: Event) => {
      if (val instanceof NavigationEnd) {
        if (val.url.match("/blog/")) viewService.view = false;
      } else viewService.view = true;
    });

    this.loadAPI = new Promise(resolve => {
      this.loadScript();
      resolve(true);
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
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  loadScript(): void {
    const scripts = document.getElementsByTagName("script");

    // Remove script
    // tslint:disable-next-line
    for (let i = 0; i < scripts.length; ++i)
      if (
        scripts[i].getAttribute("src") ===
        "https://hugofs.com/isso/js/embed.min.js"
      )
        scripts[i].parentNode.removeChild(scripts[i]);

    // Add script
    const node = document.createElement("script");
    node.src = "https://hugofs.com/isso/js/embed.min.js";
    node.setAttribute("data-isso", "https://hugofs.com/isso/");
    node.setAttribute("data-isso-css", "false");
    document.getElementsByTagName("head")[0].appendChild(node);
  }
}

interface Post {
  title: string;
  date: string;
  text: string;
}
