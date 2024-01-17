import { Directive, ElementRef, Host, OnInit, Optional, Self } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

const ACTIVE_CLASS = 'active';

@Directive({
  selector: '[blogIsActive]',
  standalone: true
})
export class IsActiveDirective implements OnInit {

  private route = this.linkButton.nativeElement.getAttribute('routerLink');
  private classList = this.linkButton.nativeElement.classList;

  constructor(
    @Host() @Self() @Optional() private linkButton: ElementRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.toggleClass(this.router.url);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => event.url.split('?')[0]),
      )
      .subscribe((url: string) => {
        this.toggleClass(url);
      });
  }

  private toggleClass(url: string) {
    if (url === this.route) {
      this.classList.add(ACTIVE_CLASS);
    } else {
      this.classList.remove(ACTIVE_CLASS);
    }
  }

}
