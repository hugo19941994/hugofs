import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ViewService } from './shared/view.service';

@Component({
  selector: 'app-root',
  styleUrls: [ './app.component.css' ],
  templateUrl: './app.component.html'
})

export class AppComponent {
  constructor(public viewService: ViewService) {}
}
