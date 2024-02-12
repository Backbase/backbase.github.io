import { MarkdownService } from 'ngx-markdown';
import { HtmlInMarkdownService } from './core/services/html-in-markdown.service';

export default function (markdownService: MarkdownService, document: Document, htmlInMarkdownService: HtmlInMarkdownService) {
  markdownService.renderer.link = (
    href: string,
    title: string | null | undefined,
    text: string
  ) => {
    const external =
      href.startsWith('http') &&
      !href.includes(document.defaultView?.window?.location.hostname || '');
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
    const mpaHref = href.startsWith('http')
      ? href
      : `${document.defaultView?.window?.location.pathname}/${href}`;
    const isVideo = ['youtube.com'].some(embed => href.includes(embed));
    if (!isVideo) {
      return `
        <figure>
          <img src="${mpaHref}" alt="${title || text}" />
          <figcaption>${parseFigCaption(text)}</figcaption>
        </figure>
      `;
    } else {
      return `
        <figure>
          <iframe src="${href}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          <figcaption>${parseFigCaption(text)}</figcaption>
        </figure>
      `;
    }
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
  markdownService.renderer.html = (html: string, block?: boolean | undefined) => {
    return htmlInMarkdownService.add(html);
  }
}

function parseFigCaption(text: string) {
  return text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
}
