import { Meta, MetaDefinition } from "@angular/platform-browser";
import { ObservabilityService } from "../services/observability.service";
import { ActivatedRoute, ActivationStart, EventType, Router } from "@angular/router";
import { filter } from "rxjs";
import { AttributeNames } from '@opentelemetry/instrumentation-user-interaction';

export function routeEvents(router: Router, activatedRoute: ActivatedRoute, meta: Meta, o11y: ObservabilityService) {
  return () => {
    router.events.pipe(
      filter((event): event is ActivationStart =>
        event.type === EventType.ActivationEnd && !!event.snapshot.component),
    ).subscribe(({ snapshot }: ActivationStart) => {
      const tags: MetaDefinition[] = snapshot.data['meta'] || [];
      tags.forEach((tag) => meta.updateTag(tag));
      o11y.publishEvent({
        [AttributeNames.EVENT_TYPE]: 'navigation'
      }, 'page_view');
    });
  }
}