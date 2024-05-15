import {
  APP_INITIALIZER,
  ApplicationConfig,
  SecurityContext,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import markdownConfig from './markdown.config';
import { DOCUMENT } from '@angular/common';
import { AUTHORS_AVATAR_PATH_TOKEN, USE_PROCESSED_IMAGES, O11Y_CONFIG_TOKEN } from './core/config/configuration-tokens';
import { HtmlInMarkdownService } from './core/services/html-in-markdown.service';
import { ObservabilityConfig } from './core/model/observability.model';
import * as pkg from '../../package.json';
import { AssetsService } from './core/services/assets.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      MarkdownModule.forRoot({
        loader: HttpClient,
        sanitize: SecurityContext.NONE,
      })
    ),
    {
      provide: O11Y_CONFIG_TOKEN,
      useValue: <ObservabilityConfig>{
        apiKey: '68435ee4-f575-4dc0-968b-c43665373f5c',
        appName: 'bb-engineering',
        version: pkg.version,
        url: 'https://rum-collector.backbase.io/v1/traces',
        enabled: !isDevMode(),
      },
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (...deps: any) => () => markdownConfig.apply(this, deps),
      deps: [MarkdownService, DOCUMENT, HtmlInMarkdownService, AssetsService],
    },
    {
      provide: AUTHORS_AVATAR_PATH_TOKEN,
      useValue: 'authors',
    },
    {
      provide: USE_PROCESSED_IMAGES,
      useValue: !isDevMode(),
    }
  ],
};
