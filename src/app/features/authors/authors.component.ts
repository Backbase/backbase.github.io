import { Component } from '@angular/core';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { map, Observable } from 'rxjs';
import { Author } from '../../core/model/author.model';
import { AuthorsService } from '../../core/services/authors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@Component({
  selector: 'blog-authors',
  standalone: true,
  imports: [CommonModule, GradientComponent, RouterLink, AvatarComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss',
})
export class AuthorsComponent {
  authors$: Observable<Author[] | undefined> = this.authorsService
    .getAuthors()
    .pipe(map(authors => Object.values(authors)));

  constructor(private authorsService: AuthorsService) {}
}
