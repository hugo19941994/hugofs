import { Component, Inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'projects',
  styleUrls: [ './projects.component.css' ],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  constructor(@Inject('req') req: any) {

  }
}
