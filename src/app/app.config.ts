import { APP_INITIALIZER, ApplicationConfig, SecurityContext, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import markdownConfig from './markdown.config';
import { DOCUMENT } from '@angular/common';
import { AUTHORS_AVATAR_PATH_TOKEN } from './core/config/configuration-tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
    })),
    {
      provide: APP_INITIALIZER,
      useFactory: markdownConfig,
      deps: [MarkdownService, DOCUMENT],
    },
    {
      provide: AUTHORS_AVATAR_PATH_TOKEN,
      useValue: 'authors'
    }
  ],
};
