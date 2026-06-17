import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'darkMode';
const DARK_THEME = 'dark-theme';
const LIGHT_THEME = 'light-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  private dark$$ = new BehaviorSubject<boolean>(false);

  public dark$ = this.dark$$.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    let initialState =
      document.defaultView?.window.matchMedia('(prefers-color-scheme: dark)')
        .matches || false;
    const storage =
      document.defaultView?.window.sessionStorage?.getItem(STORAGE_KEY);

    if (storage) {
      initialState = storage === 'true';
    }
    this.setDarkMode(initialState);
  }

  public setDarkMode(state: boolean) {
    this.document.defaultView?.window.sessionStorage?.setItem(
      STORAGE_KEY,
      `${state}`
    );
    this.dark$$.next(state);
    this.toggleBodyClass(state);
  }

  private toggleBodyClass(state: boolean) {
    this.document.documentElement.classList.remove(DARK_THEME, LIGHT_THEME);
    if (state) {
      this.document.documentElement.classList.add(DARK_THEME);
    } else {
      this.document.documentElement.classList.add(LIGHT_THEME);
    }
  }
}
