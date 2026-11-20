import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'blog-avatar',
  imports: [NgClass],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent implements AfterViewInit {
  @Input() url!: string | undefined;
  @Input() format: 'circle' | 'square' = 'circle';
  @Input() shadow = false;

  @ViewChild('avatar')
  image!: ElementRef;

  placeholder: boolean = false;

  ngAfterViewInit(): void {
    this.image?.nativeElement?.addEventListener('error', () => {
      this.placeholder = true;
    });
  }
}
