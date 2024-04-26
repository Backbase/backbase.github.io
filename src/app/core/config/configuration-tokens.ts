import { InjectionToken } from '@angular/core';

export const USE_PROCESSED_IMAGES = new InjectionToken<boolean>(
  '[CONFIG][ASSETS] Token to control source of content assets'
);
