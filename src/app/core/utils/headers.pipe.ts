import { Pipe, PipeTransform } from '@angular/core';
import { HeaderNode } from '../model/content.model';
import { marked, Token, Tokens } from 'marked';

@Pipe({
  name: 'headers',
  standalone: true,
})
export class HeadersPipe implements PipeTransform {
  transform(markdown: string): HeaderNode[] {
    const tokens = marked.lexer(markdown);
    const headings: HeaderNode[] = tokens
      .filter((t): t is Tokens.Heading => t.type === 'heading')
      .map(token => {
        const text = this.extractText(token.tokens);
        return {
          id: text.toLocaleLowerCase().replace(/\W/gm, '-'),
          heading: text,
          level: token.depth > 1 ? token.depth : 2,
          children: [],
        };
      });

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

  private extractText(tokens: Token[]): string {
    return tokens.reduce<string>((result, token) => {
      if ('tokens' in token && token.tokens) {
        return result + this.extractText(token.tokens);
      }
      if ('text' in token) {
        return result + (token as Tokens.Text).text;
      }
      return result;
    }, '');
  }
}
