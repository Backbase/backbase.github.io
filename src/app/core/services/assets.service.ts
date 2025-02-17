import { Inject, Injectable } from '@angular/core';
import { USE_PROCESSED_IMAGES } from '../config/configuration-tokens';
import { ImageSize } from '../model/content.model';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(
    @Inject(USE_PROCESSED_IMAGES) private useProcessedImages: boolean
  ) {}

  getAssetPath(url: string, size: ImageSize) {
    if (this.useProcessedImages && !url.startsWith('http')) {
      const fragments = url.split('/');
      fragments.splice(fragments.length - 1, 0, 'dist', size);
      return fragments.filter(Boolean).join('/');
    }
    return url;
  }
}
