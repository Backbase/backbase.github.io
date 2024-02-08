import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, HostListener, Inject, Input } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderNode, HeaderTreeNode } from '../../core/model/content.model';
import { RouterLink } from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';

@Component({
  selector: 'blog-table-of-content',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterLink, NgClass],
  templateUrl: './table-of-content.component.html',
  styleUrl: './table-of-content.component.scss',
})
export class TableOfContentComponent {
  @Input() set headers(headers: HeaderNode[]) {
    this.dataSource.data = headers;
    this.treeControl.expandAll();
    if (headers.length) {
      this.createOffsets(headers);
      this.activeHeader = this.offsetHeaders[0];
    }
  }

  @Input() current!: string;

  offsetHeaders: string[] = [];

  activeHeader: string | null = null;

  @HostListener('document:scroll', ['$event'])
  public onViewportScroll() {
    if (this.offsetHeaders.length) {
      const scroll = Math.ceil(this.document.documentElement.scrollTop);
      const fullHeightWithScroll = this.document.body.scrollHeight;
      const fullHeight =
        this.document.body.scrollHeight - this.document.body.clientHeight;

      for (let i = 0; i < this.offsetHeaders.length; i++) {
        const element = this.offsetHeaders[i];
        const nextElement = this.offsetHeaders[i + 1];

        const offset = this.document.getElementById(element)?.offsetTop;
        const nextOffset = nextElement
          ? this.document.getElementById(nextElement)?.offsetTop
          : fullHeightWithScroll;

        if (offset == null || nextOffset == null) {
          continue;
        }

        if (fullHeight === scroll) {
          this.activeHeader = this.offsetHeaders[this.offsetHeaders.length - 1];
          return;
        }

        if (scroll >= offset && scroll < nextOffset) {
          this.activeHeader = element;
          return;
        }
      }
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  private _transformer = (node: HeaderNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.heading,
      level: level,
      id: node.id,
    };
  };

  treeControl = new FlatTreeControl<HeaderTreeNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: HeaderTreeNode) => node.expandable;

  private createOffsets(data: HeaderNode[], array = this.offsetHeaders) {
    for (const element of data) {
      array.push(element.id);

      if (element.children.length) {
        this.createOffsets(element.children, array);
      }
    }
  }
}
