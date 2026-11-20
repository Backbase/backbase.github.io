import {
  Inject,
  Injectable,
  PLATFORM_ID,
  DOCUMENT,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HtmlInMarkdownService {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  add(html: string) {
    if (html.startsWith('<br') || html.startsWith('<!--')) {
      return html;
    }

    return `<iframe src="about:blank" data-content="${this.document.defaultView?.window.btoa?.(html)}"></iframe>`;
  }

  parseAll() {
    if (!this.isBrowser) {
      return;
    }

    const frames = this.document.querySelectorAll('iframe[data-content]');
    frames.forEach(iframe => {
      const contentWindow = (iframe as HTMLIFrameElement).contentWindow;
      if (!contentWindow) {
        return;
      }

      const content = this.document.defaultView?.window.atob?.(
        iframe.getAttribute('data-content') ?? ''
      );
      iframe.removeAttribute('data-content');
      const frameDoc = contentWindow.document;
      frameDoc.open();
      frameDoc.write(`
      <html>
        <head>
          <base target="_parent">
        </head>
        <body style="margin: 0">
          ${content}
        </body>
      </html>
    `);
      frameDoc.close();
      new MutationObserver(() => {
        iframe.setAttribute('style', `height: ${frameDoc.body.scrollHeight}px`);
      }).observe(frameDoc.body, { childList: true });
    });
  }
}
