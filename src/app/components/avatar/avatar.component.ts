import { Component, Inject, Input } from '@angular/core';
import { AssetsService } from '../../core/services/assets.service';
import { AUTHORS_AVATAR_PATH_TOKEN } from '../../core/config/configuration-tokens';

@Component({
  selector: 'blog-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  private _url: string | null = null;

  @Input() set url(value: string | null) {
    this._url = value;
  }

  get url(): string | null {
    if (this._url) {
      return `${this.assetService.getBase('lg', this.basePath)}/${this._url}`;
    }
    return null;
  }

  placeholder = `${this.assetService.getBase('lg', this.basePath)}/placeholder.jpg`;

  constructor(
    private assetService: AssetsService,
    @Inject(AUTHORS_AVATAR_PATH_TOKEN) private basePath: string,
  ) {}
}
