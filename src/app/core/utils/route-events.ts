import { Meta, MetaDefinition } from "@angular/platform-browser";
import { ObservabilityService } from "../services/observability.service";
import { ActivationStart, EventType, Router } from "@angular/router";
import { filter } from "rxjs";
import { AttributeNames } from '@opentelemetry/instrumentation-user-interaction';

export function routeEvents(router: Router, meta: Meta, o11y: ObservabilityService) {
  router.events.pipe(
    filter((event): event is ActivationStart =>
      event.type === EventType.ActivationEnd && !!event.snapshot.component),
  ).subscribe(({ snapshot }: ActivationStart) => {
    const tags: MetaDefinition[] = snapshot.data['meta'] ?? [];
    meta.removeTag('name="robots"');
    tags.forEach((tag) => meta.updateTag(tag));
    o11y.publishEvent({
      [AttributeNames.EVENT_TYPE]: 'navigation'
    }, 'page_view');
  });
}