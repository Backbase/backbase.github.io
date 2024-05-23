import { InjectionToken } from '@angular/core';
import { ObservabilityConfig } from '../model/observability.model';
import { Category } from '../model/categories.model';

export const AUTHORS_AVATAR_PATH_TOKEN = new InjectionToken<string>(
  '[CONFIG][ASSETS] Authors avatar directory path'
);

export const O11Y_CONFIG_TOKEN = new InjectionToken<ObservabilityConfig>(
  '[CONFIG][O11Y] Observability config provider'
);

export const USE_PROCESSED_IMAGES = new InjectionToken<boolean>(
  '[CONFIG][ASSETS] Token to control source of content assets'
);

export const SPECIAL_CATEGORIES = new InjectionToken<Category[]>(
  '[CONFIG] Categories with special permalink'
);
