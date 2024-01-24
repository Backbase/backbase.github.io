import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[blogHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges, AfterViewInit {
  @Input('blogHighlight') searchTerm: string | null = '';
  @Input() caseSensitive = false;
  @Input() customClasses = '';

  // @HostBinding('innerHtml')
  // content: string | undefined;

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.el?.nativeElement) {
      if ('searchTerm' in changes || 'caseSensitive' in changes) {
        this.addHighlight(this.searchTerm);
      }
    }
  }

  addHighlight(search: string | null) {
    if (!search) {
      return;
    }

    const element = this.el.nativeElement as HTMLElement;
    const html = element.innerHTML;
    const regex = new RegExp(search, this.caseSensitive ? 'g' : 'gi');

    if (regex.test(html)) {
      const newText = html?.replace(
        regex,
        (match: string) =>
          `<mark class="highlight ${this.customClasses}">${match}</mark>`
      );
      const newContent = this.sanitizer.sanitize(SecurityContext.HTML, newText);
      if (newContent) {
        element.innerHTML = newContent;
      }
    }
  }

  ngAfterViewInit() {
    this.addHighlight(this.searchTerm);
  }
}
