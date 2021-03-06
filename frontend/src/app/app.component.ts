import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ViewService } from './shared/view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private readonly meta: Meta,
    private readonly titleService: Title,
    public viewService: ViewService
  ) {
    this.meta.addTag({
      name: 'description',
      content:
        'My personal website and blog about software engineering and computer science.'
    });

    this.meta.addTag({
      name: 'theme-color',
      content: '#303030'
    });

    this.meta.addTag({
      name: 'viewport',
      content: 'width=device-width,minimum-scale=1'
    });

    this.titleService.setTitle('Hugo FS');
  }

  // title = 'hugofs';
}
