import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  WebTracerProvider,
  BatchSpanProcessor,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import opentelemetry, { Attributes, Span } from '@opentelemetry/api';

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { O11Y_CONFIG_TOKEN } from '../config/configuration-tokens';
import { ObservabilityConfig } from '../model/observability.model';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AttributeNames } from '@opentelemetry/instrumentation-user-interaction';

const ANONYMOUS_USER_ID = 'uid';

@Injectable({
  providedIn: 'root',
})
export class ObservabilityService {
  constructor(
    @Inject(O11Y_CONFIG_TOKEN) private config: ObservabilityConfig,
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    if (isPlatformBrowser(platformId) && config.enabled) {
      this.initiateTracking();
    }
  }

  private initiateTracking() {
    const { appName, version, url, apiKey } = this.config;

    const resource = Resource.default()?.merge(
      new Resource({
        [SEMRESATTRS_SERVICE_NAME]: appName,
        [SEMRESATTRS_SERVICE_VERSION]: version,
        sessionId: this.getSessionId(),
      })
    );

    const provider = new WebTracerProvider({
      resource,
      sampler: new TraceIdRatioBasedSampler(1),
    });

    provider.addSpanProcessor(
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: url,
          headers: {
            'Bb-App-Key': apiKey,
          },
        })
      )
    );

    provider.register({
      contextManager: new ZoneContextManager(),
    });

    provider.getActiveSpanProcessor().onStart = (span: Span) => {
      span.setAttribute('view.name', document.title);
      span.setAttribute(AttributeNames.HTTP_URL, document.location.href);
    };

    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-document-load': {},
          '@opentelemetry/instrumentation-user-interaction': {},
        }),
      ],
    });
  }

  public publishEvent(payload: Attributes, event: string) {
    opentelemetry.trace
      .getTracer('@blog/observability')
      .startActiveSpan(event, activeSpan => {
        activeSpan.setAttributes(payload);
        activeSpan.end();
      });
  }

  private getSessionId(): string {
    const storage = this.document.defaultView?.window.sessionStorage;
    let sessionId: string = `${storage?.getItem(ANONYMOUS_USER_ID)}`;
    if (!this.isHex(sessionId)) {
      const newSessionId = window?.crypto
        ?.getRandomValues(new Uint32Array(1))[0]
        .toString(16);
      storage?.setItem(ANONYMOUS_USER_ID, newSessionId);
      sessionId = newSessionId;
    }
    return sessionId;
  }

  private isHex(value: string) {
    return /^[0-9a-fA-F]{8}$/.test(value);
  }
}
