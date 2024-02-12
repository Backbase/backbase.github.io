import { TestBed } from '@angular/core/testing';

import { HtmlInMarkdownService } from './html-in-markdown.service';

describe('HtmlInMarkdownService', () => {
  let service: HtmlInMarkdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlInMarkdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
