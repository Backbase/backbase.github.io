import { PostAuthorsPipe } from './post-authors.pipe';

describe('PostAuthorsPipe', () => {
  it('create an instance', () => {
    const pipe = new PostAuthorsPipe();
    expect(pipe).toBeTruthy();
  });
});
