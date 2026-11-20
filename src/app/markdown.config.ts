import { MarkdownService } from 'ngx-markdown';
import { Tokens } from 'marked';
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
  markdownService.renderer.link = function ({
    href,
    title,
    text,
    tokens,
    autolink,
  }: Tokens.Link) {
    const content =
      tokens && !autolink ? this.parser.parseInline(tokens) : text;
    const external =
      href.startsWith('http') &&
      !href.includes(document.defaultView?.window?.location.hostname ?? '');
    if (content.includes('<figure>')) {
      return content
        .replace(
          '<figure>',
          `<figure class="image-link"><a href="${href}" ${title ? 'title="' + title + '"' : ''} ${external ? 'target="_blank"' : ''}>`
        )
        .replace(
          '</figure>',
          `${external ? '<span class="material-icons external">open_in_new</span>' : ''}</a></figure>`
        );
    }
    return `
      <a href="${href}" ${title ? 'title="' + title + '"' : ''} ${external ? 'target="_blank"' : ''}>
        ${content} ${external ? '<span class="material-icons external">open_in_new</span>' : ''}
      </a>
    `;
  };

  markdownService.renderer.image = function ({
    href,
    title,
    text,
    tokens,
  }: Tokens.Image) {
    const alt =
      tokens && tokens.length
        ? this.parser.parseInline(tokens, this.parser.textRenderer)
        : text;
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
            alt="${title ?? alt}"
          />
        </picture> 
        <figcaption>${parseFigCaption(alt)}</figcaption>
      </figure>
    `;
  };

  markdownService.renderer.heading = function ({
    tokens,
    depth,
  }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    const auxDiv = document.createElement('div');
    auxDiv.innerHTML = text;
    const id = auxDiv.textContent?.toLocaleLowerCase().replace(/\W/gm, '-');
    const level = depth > 1 ? depth : 2;
    return `
      <h${level} id="${id}">${text}</h${level}>
    `;
  };

  markdownService.renderer.html = function ({
    text,
  }: Tokens.HTML | Tokens.Tag) {
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
