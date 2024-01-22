import {
  MergeStrategy,
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  move,
  template,
  url,
  strings,
} from '@angular-devkit/schematics';
import { normalize } from 'path';

export function postScaffolder(options: any): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const { getPermalink } =
      await loadEsmModule<typeof import('@blog/utils')>('@blog/utils');

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
        stringify,
      }),
      move(normalize(`content/posts/${getPermalink(options.title)}`)),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Default);
    return rule(tree, context);
  };
}

function stringify(value: string) {
  return JSON.stringify(value.split(','));
}

function loadEsmModule<T>(modulePath: string): Promise<T> {
  return new Function('modulePath', `return import(modulePath);`)(
    modulePath
  ) as Promise<T>;
}
