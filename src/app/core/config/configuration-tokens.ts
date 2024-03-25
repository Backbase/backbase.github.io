import { InjectionToken } from '@angular/core';
import { ObservabilityConfig } from '../model/observability.model';

export const AUTHORS_AVATAR_PATH_TOKEN = new InjectionToken<string>(
  '[CONFIG][ASSETS] Authors avatar directory path'
);

export const O11Y_CONFIG_TOKEN = new InjectionToken<ObservabilityConfig>(
  '[CONFIG][O11Y] Observability config provider'
);
