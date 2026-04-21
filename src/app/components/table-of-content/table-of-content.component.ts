import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderNode } from '../../core/model/content.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'blog-table-of-content',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterLink, NgClass],
  templateUrl: './table-of-content.component.html',
  styleUrl: './table-of-content.component.scss',
})
export class TableOfContentComponent implements AfterViewInit {
  @ViewChild(MatTree) tree?: MatTree<HeaderNode>;

  _headers: HeaderNode[] = [];

  @Input() set headers(headers: HeaderNode[]) {
    this._headers = headers;
    if (headers.length) {
      this.offsetHeaders = this.createOffsets(headers);
      this.checkFirstHeader();
    }
    queueMicrotask(() => this.tree?.expandAll());
  }

  @Input() current!: string;

  offsetHeaders: string[] = [];

  activeHeader: string | undefined = '';

  childrenAccessor = (node: HeaderNode) => node.children ?? [];

  hasChild = (_: number, node: HeaderNode) => node.children?.length > 0;

  @HostListener('document:scroll')
  public onViewportScroll() {
    if (this.offsetHeaders.length) {
      const scroll = Math.ceil(this.document.documentElement.scrollTop);
      const fullHeightWithScroll = this.document.body.scrollHeight;
      const fullHeight =
        this.document.body.scrollHeight - this.document.body.clientHeight;

      if (scroll >= fullHeight) {
        this.activeHeader = this.offsetHeaders[this.offsetHeaders.length - 1];
        return;
      }

      const firstElementOffset = this.document.getElementById(
        this.offsetHeaders[0]
      )?.offsetTop;

      if (scroll < Number(firstElementOffset)) {
        this.activeHeader = this.offsetHeaders[0];
        return;
      }

      this.activeHeader = this.offsetHeaders.find(
        (element, i, offsetHeaders) => {
          const nextElement = offsetHeaders[i + 1];

          const offset = this.document.getElementById(element)?.offsetTop;
          const nextOffset = nextElement
            ? this.document.getElementById(nextElement)?.offsetTop
            : fullHeightWithScroll;

          return scroll >= Number(offset) && scroll < Number(nextOffset);
        }
      );
    }
  }

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.tree?.expandAll();
    this.route.fragment.pipe(first()).subscribe(fragment => {
      if (fragment) {
        this.activeHeader = fragment;
        this.checkFirstHeader();
      }
    });
  }

  private createOffsets(data: HeaderNode[]): string[] {
    return data.reduce(
      (offsetHeaders: string[], element: HeaderNode) => [
        ...offsetHeaders,
        element.id,
        ...(element.children.length
          ? this.createOffsets(element.children)
          : []),
      ],
      []
    );
  }

  private checkFirstHeader(): void {
    if (!this.offsetHeaders.length) {
      return;
    }

    if (!this.activeHeader) {
      this.activeHeader = this.offsetHeaders[0];
    }

    const el = this.document.getElementById(this.activeHeader!);
    if (el && this.offsetHeaders.includes(this.activeHeader!)) {
      this.document.documentElement.scrollTo(0, el.offsetTop);
    }
  }
}
