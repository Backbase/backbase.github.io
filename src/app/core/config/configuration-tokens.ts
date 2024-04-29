import { InjectionToken } from '@angular/core';

export const AUTHORS_AVATAR_PATH_TOKEN = new InjectionToken<string>(
  '[CONFIG][ASSETS] Authors avatar directory path'
);

export const USE_PROCESSED_IMAGES = new InjectionToken<boolean>(
  '[CONFIG][ASSETS] Token to control source of content assets'
);
