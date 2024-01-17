import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(mod => mod.HomeComponent),
  },
  {
    path: ':year/:month/:day/:permalink',
    loadComponent: () => import('./features/post/post.component').then(m => m.PostComponent),
  },
  {
    path: 'unpublished/:permalink',
    loadComponent: () => import('./features/post/post.component').then(m => m.PostComponent),
  },
  {
    path: 'category/:cat',
    loadComponent: () =>
      import('./features/category/category.component').then(m => m.CategoryComponent),
  },
  {
    path: 'principles',
    loadComponent: () =>
      import('./features/principles/principles.component').then(m => m.PrinciplesComponent),
  },
  {
    path: 'principles/:permalink',
    loadComponent: () =>
      import('./features/post/post.component').then(m => m.PostComponent),
  }
];
