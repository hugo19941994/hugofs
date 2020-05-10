import { DOCUMENT } from '@angular/common';
import {AfterViewInit, Component, ElementRef, Inject, Input, Renderer2} from '@angular/core';
import { Router } from '@angular/router';

interface Page {
  url: string;
  identifier: string;
}

@Component({
    selector: 'app-disqus',
    template: '<div id="disqus_thread"></div>',
})
export class DisqusComponent implements AfterViewInit {

  @Input() identifier: string;
  shortname = 'hugofs-com';
  page: Page = {
    url: '',
    identifier: ''
  };
  language = '';

    constructor(private readonly el: ElementRef, private readonly renderer: Renderer2,
                @Inject(DOCUMENT) private readonly document: Document, private readonly router: Router) {}

    ngAfterViewInit(): void {
      if ((window as any).DISQUS === undefined) {
        this.addScriptTag();
      }
      else {
        this.reset();
      }
    }

    /**
     * Reset Disqus with new information.
     */
    reset(): void{
      (window as any).DISQUS.reset({
        reload: true,
        config: this.getConfig()
      });
    }

    /**
     * Add the Disqus script to the document.
     */
    addScriptTag(): void{
       (window as any).disqus_config = this.getConfig();

       const script = this.document.createElement('script');
       script.src = `//${this.shortname}.disqus.com/embed.js`;
       script.async = true;
       script.type = 'text/javascript';
       script.setAttribute('data-timestamp', new Date().getTime().toString());
       this.el.nativeElement.appendChild(script);

     }

    /**
     * Get Disqus config
     */
    getConfig(): () => void {
      return () => {
        this.page.url = this.router.url;
        this.page.identifier = this.identifier;
        this.language = 'en';
      };
    }
}
