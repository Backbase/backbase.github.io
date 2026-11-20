import { Inject, Pipe, PipeTransform, DOCUMENT } from '@angular/core';
import { marked, Renderer, Tokens } from 'marked';
import { HeaderNode } from '../model/content.model';

@Pipe({
  name: 'headers',
  standalone: true,
})
export class HeadersPipe implements PipeTransform {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  transform(markdown: string): HeaderNode[] {
    if (!markdown) {
      return [];
    }

    const doc = this.document;
    const renderer = new Renderer();
    renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens);
      const auxDiv = doc.createElement('div');
      auxDiv.innerHTML = text;
      const id = auxDiv.textContent?.toLocaleLowerCase().replace(/\W/gm, '-');
      const level = depth > 1 ? depth : 2;
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    const html = marked.parse(markdown, { renderer, async: false }) as string;
    const regExp = new RegExp(/<h\d(.*?)<\/h\d>/gm);
    const matches = html.match(regExp);

    const nodes: Element[] =
      matches?.map(raw => {
        const node = doc.createElement('div');
        node.innerHTML = raw;
        return node.firstElementChild as Element;
      }) ?? [];

    const headings = nodes.map(node => ({
      id: node.getAttribute('id') as string,
      heading: node.textContent as string,
      level: Number(node.tagName.replace(/\D/g, '')),
      children: [],
    }));

    const title = headings.shift();

    return headings
      .reduce(
        (hierarchy: HeaderNode[], node: HeaderNode) => {
          while (hierarchy[hierarchy.length - 1].level >= node.level) {
            hierarchy.pop();
          }
          hierarchy[hierarchy.length - 1].children.push(node);
          hierarchy.push(node);

          return hierarchy;
        },
        [
          {
            id: 'post-header',
            heading: title?.heading || 'Header',
            level: 1,
            children: [],
          },
        ]
      )
      .splice(0, 1);
  }
}
