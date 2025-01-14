import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  mergeWith,
  MergeStrategy,
} from '@angular-devkit/schematics';

export function meetupScaffolder(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const currentDate = new Date().toISOString();

    const templateSource = apply(url('./files'), [
      template({
        ...options,
        currentDate,
        stringify,
      }),
      move(`content/posts/meetups/${toKebabCase(options.title)}`),
    ]);

    const rule = mergeWith(templateSource, MergeStrategy.Default);

    return rule(tree, context);
  };
}

function stringify(value: string) {
  return JSON.stringify(value.split(','));
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
}
