import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavigationService {

  private currentPage$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public currentPage$ = this.currentPage$$.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
  ) {
    const page = this.activatedRoute.snapshot.queryParamMap.get('p');
    if (page && typeof Number(page) === 'number') {
      this.currentPage$$.next(Number(page) - 1)
    }
  }

  navigate(pageIndex: number) {
    this.currentPage$$.next(pageIndex);
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          p: pageIndex + 1,
        }, 
        queryParamsHandling: 'merge',
        fragment: 'list'
      }
    );
  }
}
