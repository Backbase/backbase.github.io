import { Inject, Injectable } from '@angular/core';
import { USE_PROCESSED_IMAGES } from '../config/configuration-tokens';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(@Inject(USE_PROCESSED_IMAGES) private useProcessedImages: Boolean) { }

  getBase(size: string, base: string = '/') {
    return `${base}${this.useProcessedImages ? '/dist/' + size : ''}`;
  }
}
