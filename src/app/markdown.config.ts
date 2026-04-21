import { MarkdownService } from 'ngx-markdown';
import { Renderer, Tokens } from 'marked';
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
  const renderer = markdownService.renderer;

  renderer.link = function (this: Renderer, { href, title, tokens }: Tokens.Link) {
    const text = this.parser.parseInline(tokens);
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

  renderer.image = ({ href, title, text }: Tokens.Image) => {
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

  renderer.heading = function (this: Renderer, { tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    const auxDiv = document.createElement('div');
    auxDiv.innerHTML = text;
    const id = auxDiv.textContent?.toLocaleLowerCase().replace(/\W/gm, '-');
    const level = depth > 1 ? depth : 2;
    return `
      <h${level} id="${id}">${text}</h${level}>
    `;
  };

  renderer.html = ({ text }: Tokens.HTML | Tokens.Tag) => {
    if (text.startsWith('<iframe')) {
      const caption: string | undefined = text.match(/title="([^"]+)/)?.[1];
      return `
        <figure>
          ${text}
          ${caption ? '<figcaption>' + caption + '</figcaption>' : ''}
        </figure>
      `;
    }

    return htmlInMarkdownService.add(text);
  };
}

function parseFigCaption(text: string) {
  return text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
}
