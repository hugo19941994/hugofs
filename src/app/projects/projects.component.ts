import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'projects',
  styleUrls: [ './projects.component.css' ],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {}
