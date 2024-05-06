# Migration from Karma/Jasmine to Jest

Given the faster execution, clearer stack trace of Jest, Karma is being deprecated; decided to migrate to Jest.

![](assets/migration_karma_jest.png)

Authors: Utku, Omar Rojas
Date: 2024-05-06T15:28:51.865Z
Category: frontend

tags: web,testing,test,unit,frontend,karma,jest,jasmine

---

## Introduction

In Angular 16, Karma was deprecated while Jest was introduced in experimental mode. The Angular team moved towards Jest as the recommended testing framework for Angular applications. While Karma was the default testing framework for Angular in the past, Jest is being explored as a potential replacement due to its simplicity, speed, and built-in features like snapshot testing and mocking. However, it’s important to note that Jest is still in the experimental stage in Angular 16 and Angular 17, and using it in production may have limitations or unsupported features.

Given the faster execution, clearer stack trace of Jest, Karma is being deprecated; decided to migrate to Jest.

## Migration

In Backbase, we use Nx Angular schematics to generate our applications. The steps described below to complete the migration follow that specific project structure. If you have a different project structure, these steps may still provide you with the direction you want to take, considering the needed changes applicable to the different folder structures.

1. Delete the tests properties inside targets object completely in **project.json** files.

2. Delete all the references to **karma.conf.js** files by globally searching in your project.

3. Delete all **karma.conf.js** files.

4. Delete all **test.ts** files.

5. Delete all Karma and Jasmine related dependencies from **package.json**.

6. Run `npm i` to update **package-lock.json** and **node_modules**.

7. Go to [@nx/jest | Nx](https://nx.dev/nx-api/jest) to follow the instructions below:

    1. Do not install the **nx/jest** unless you don’t already have it in **package.json**.

    2. To add Jest to projects, run `nx g @nx/jest:configuration --project=<project-name>` for all projects in the repository one by one except e2e and assets projects. This command will add required config to **project.json** files as well as making changes in **tsconfig.spec.json** and **jest.config.ts** files per project. This will allow Nx to run tests properly. Content of **jest.config.ts**:

    ```typescript
    export default {
      displayName: 'demo-angular',
      preset: '../../jest.preset.js',
      coverageDirectory: '../../coverage/apps/demo-angular',
    };
    ```

8. Replace compilerOptions → types property value in **tsconfig.editor.json** to `["jest", "node"]`.

9. Add `jest-preset-angular` as devDependency (along with **jest** and **@types/jest** if they don’t already exist) with `npm install -D jest jest-preset-angular @types/jest`

10. Make sure that you have **setup-jest.ts** files inside src directory of each Nx lib and app. If it doesn’t exist, manually create it. There should be one in the root directory of the repo.

    1. **setup-jest.ts** files will likely need mocking **TextEncoder** and import of **@angular/localize/init** additionally. Can be tested without them and added if required. Here is an example content of it:

    ```typescript
    import 'jest-preset-angular/setup-jest';
    import '@angular/localize/init';
    import { TextEncoder } from 'node:util';
    // Workaround for Jest error - ReferenceError: TextEncoder is not defined
    Object.defineProperty(window, 'TextEncoder', {
      writable: true,
      value: TextEncoder,
    });
    ```

11. **jest.preset.js** file in root of the repo will likely need to have below content. **transform** and **transformIgnorePatterns** values can be changed depending on your needs.

    ```typescript
    const nxPreset = require('@nx/jest/preset').default;
    module.exports = {
      ...nxPreset,
      coverageReporters: ['lcov'],
      collectCoverage: true,
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: -10,
        },
      },
      setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
      transform: {
        '^.+.(ts|mjs|js|html)$': [
          'jest-preset-angular',
          {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.(html|svg)$',
          },
        ],
      },
      transformIgnorePatterns: ['node_modules/(?!(d3.*|internmap|.*\\.mjs$))'],
    };
    ```

12. Transform all the Jasmine tests to Jest. There will likely be failing existing tests. Run tests again and again and fix them until there is no failing test.

13. If you have Sonar in your project, make sure to add **setup-jest.ts** files to the **sonar.test.exclusions** and **sonar.coverage.exclusions** properties of **sonar-project.properties** file. An example glob pattern:

    ```
    sonar.test.exclusions=\
      libs/**/setup-jest.ts,\
      apps/**/setup-jest.ts,\
      .............
    sonar.coverage.exclusions=\
      libs/**/setup-jest.ts,\
      apps/**/setup-jest.ts,\
      .............
    ```


### Eventual Folder Structure


```
.
├── jest.config.ts
├── jest.preset.js
├── apps
│   ├── app
│   │   ├── jest.config.ts
│   │   └── src
│   │       └── setup-jest.ts
└── libs
    ├── lib
    │   ├── jest.config.ts
    │   └── src
    │       └── setup-jest.ts
```

## References

**transformIgnorePatterns**: [Troubleshooting | jest-preset-angular](https://thymikee.github.io/jest-preset-angular/docs/guides/troubleshooting/#unexpected-token-importexportother)

[@nx/jest](https://nx.dev/nx-api/jest)
