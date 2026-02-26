import { Inject, Injectable, DOCUMENT } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HtmlInMarkdownService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  add(html: string) {
    if (html.startsWith('<br') || html.startsWith('<!--')) {
      return html;
    }

    return `<iframe src="about:blank" data-content="${this.document.defaultView?.window.btoa?.(html)}"></iframe>`;
  }

  parseAll() {
    const frames = this.document.querySelectorAll('iframe[data-content]');
    frames.forEach(iframe => {
      const content = this.document.defaultView?.window.atob?.(
        iframe.getAttribute('data-content') ?? ''
      );
      iframe.removeAttribute('data-content');
      const frameDoc = (iframe as any).contentWindow.document as Document;
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
