import { Inject, Pipe, PipeTransform, DOCUMENT } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { HeaderNode } from '../model/content.model';

@Pipe({
  name: 'headers',
  standalone: true,
})
export class HeadersPipe implements PipeTransform {
  transform(markdown: string): HeaderNode[] {
    const regExp = new RegExp(/<h\d(.*?)<\/h\d>/gm);
    const matches = this.markdownService
      .parse(markdown)
      .toString()
      .match(regExp);

    const nodes: Element[] =
      matches?.map(raw => {
        const node = this.document.createElement('div');
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

  constructor(
    private markdownService: MarkdownService,
    @Inject(DOCUMENT) private document: Document
  ) {}
}
