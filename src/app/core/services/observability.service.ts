import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
    WebTracerProvider,
    BatchSpanProcessor,
    TraceIdRatioBasedSampler,
    Span,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import opentelemetry from '@opentelemetry/api';

import { Inject, Injectable } from '@angular/core';
import { O11Y_CONFIG_TOKEN } from '../config/configuration-tokens';
import { ObservabilityConfig } from '../model/observability.model';
import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class ObservabilityService {
  private initiated = false;

  constructor(
    @Inject(O11Y_CONFIG_TOKEN) private config: ObservabilityConfig,
  ) {
  }

  public initiateTracking() {
    if (this.initiated) {
      return;
    }

    const { appName, version, url, apiKey } = this.config;

    const resource = Resource.default()?.merge(
      new Resource({
        [SEMRESATTRS_SERVICE_NAME]: appName,
        [SEMRESATTRS_SERVICE_VERSION]: version,
        sessionId: this.generateSessionId(),
      }),
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
        }),
      ),
    );
    
    provider.register({
      contextManager: new ZoneContextManager(),
    });
    
    provider.getActiveSpanProcessor().onStart = (span: Span) => {
      span.setAttribute('view.name', 'Backbase Engineering');
      span.setAttribute('view.path', document.location.href);
    };
    
    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-document-load': {},
          '@opentelemetry/instrumentation-user-interaction': {},
          '@opentelemetry/instrumentation-fetch': {},
          '@opentelemetry/instrumentation-xml-http-request': {},
        }),
      ],
    });

    this.initiated = true;
  }

  public publishEvent(payload: Post) {
    opentelemetry.trace.getTracer('@blog/observability').startActiveSpan('page view', activeSpan => {
      activeSpan.setAttributes({
        post: payload.title,
        category: payload.category,
        'location.href': window.location.href,
        'user.action.event.type': 'navigation'
      });
      activeSpan.end();
    });
  }

  private generateSessionId(): string {
    return window?.crypto?.getRandomValues(new Uint32Array(1))[0].toString(16);
  }
}
