import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderNode, HeaderTreeNode } from '../../core/model/content.model';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'blog-table-of-content',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterLink, NgClass],
  templateUrl: './table-of-content.component.html',
  styleUrl: './table-of-content.component.scss'
})
export class TableOfContentComponent {
  @Input() set headers(headers: HeaderNode[]) {
    this.dataSource.data = headers;
    this.treeControl.expandAll();
  };
  @Input() current!: string;

  private _transformer = (node: HeaderNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.heading,
      level: level,
      id: node.id
    };
  };

  treeControl = new FlatTreeControl<HeaderTreeNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: HeaderTreeNode) => node.expandable;
}