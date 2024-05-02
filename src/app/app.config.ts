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
import { HtmlInMarkdownService } from './core/services/html-in-markdown.service';
import { AssetsService } from './core/services/assets.service';
import { AUTHORS_AVATAR_PATH_TOKEN, USE_PROCESSED_IMAGES } from './core/config/configuration-tokens';

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
      provide: APP_INITIALIZER,
      useFactory: markdownConfig,
      deps: [MarkdownService, DOCUMENT, HtmlInMarkdownService, AssetsService],
    },
    {
      provide: AUTHORS_AVATAR_PATH_TOKEN,
      useValue: 'authors',
    },
    {
      provide: USE_PROCESSED_IMAGES,
      useValue: true || !isDevMode(),
    }
  ],
};
