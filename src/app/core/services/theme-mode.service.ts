import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'darkMode';
const DARK_THEME = 'dark-theme';
const LIGHT_THEME = 'light-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeModeService {
  private dark$$ = new BehaviorSubject<boolean>(false);

  public dark$ = this.dark$$.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    const initialState = document.defaultView?.window.localStorage?.getItem(STORAGE_KEY) === 'true';
    this.setDarkMode(initialState);
  }

  public setDarkMode(state: boolean) {
    this.document.defaultView?.window.localStorage?.setItem(STORAGE_KEY, `${state}`);
    this.dark$$.next(state);
    this.toggleBodyClass(state);
  }

  private toggleBodyClass(state: boolean) {
    this.document.documentElement.classList.remove(DARK_THEME, LIGHT_THEME)
    if (state) {
      this.document.documentElement.classList.add(DARK_THEME);
    } else {
      this.document.documentElement.classList.add(LIGHT_THEME);
    }
  }
}
