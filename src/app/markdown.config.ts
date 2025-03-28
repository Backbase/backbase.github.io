import { MarkdownService } from 'ngx-markdown';
import { HtmlInMarkdownService } from './core/services/html-in-markdown.service';
import { AssetsService } from './core/services/assets.service';
import { Router } from '@angular/router';

export default function (
  markdownService: MarkdownService,
  document: Document,
  htmlInMarkdownService: HtmlInMarkdownService,
  assetsService: AssetsService,
  router: Router
) {
  markdownService.renderer.link = (
    href: string,
    title: string | null | undefined,
    text: string
  ) => {
    const external =
      href.startsWith('http') &&
      !href.includes(document.defaultView?.window?.location.hostname ?? '');
    if (text.includes('<figure>')) {
      return text
        .replace(
          '<figure>',
          `<figure class="image-link"><a href="${href}" ${title ? 'title="' + title + '#' : ''} ${external ? 'target="_blank"' : ''}>`
        )
        .replace(
          '</figure>',
          `${external ? '<span class="material-icons external">open_in_new</span>' : ''}</a></figure>`
        );
    }
    return `
      <a href="${href}" ${title ? 'title="' + title + '#' : ''} ${external ? 'target="_blank"' : ''}>
        ${text} ${external ? '<span class="material-icons external">open_in_new</span>' : ''}
      </a>
    `;
  };
  markdownService.renderer.image = (
    href: string,
    title: string | null,
    text: string
  ) => {
    const pathname = router.url;
    const url = `${pathname}/${href}`;
    return `
      <figure>
        <picture>
          <source
            srcset="${assetsService.getAssetPath(url, 'lg')}"
            media="(min-width: 1200px)"
          />
          <source
            srcset="${assetsService.getAssetPath(url, 'md')}"
            media="(min-width: 800px)"
          />
          <img
            srcset="${assetsService.getAssetPath(url, 'md')}"
            alt="${title ?? text}"
          />
        </picture> 
        <figcaption>${parseFigCaption(text)}</figcaption>
      </figure>
    `;
  };
  markdownService.renderer.heading = (
    text: string,
    level: number,
    raw: string
  ) => {
    const auxDiv = document.createElement('div');
    auxDiv.innerHTML = text;
    const id = auxDiv.textContent?.toLocaleLowerCase().replace(/\W/gm, '-');
    return `
      <h${level > 1 ? level : 2} id="${id}">${text}</h${level}>
    `;
  };
  markdownService.renderer.html = (
    html: string,
    block?: boolean | undefined
  ) => {
    if (html.startsWith('<iframe')) {
      const caption: string | undefined = html.match(/title="([^"]+)/)?.[1];
      return `
        <figure>
          ${html}
          ${caption ? '<figcaption>' + caption + '</figcaption>' : ''}
        </figure>
      `;
    }

    return htmlInMarkdownService.add(html);
  };
}

function parseFigCaption(text: string) {
  return text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
}
