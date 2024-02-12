import { Route } from '@angular/router';

const routes = [
  ['2023/12/13/setup-microfrontend', '2023/12/13/angular-micro-frontends'],
  ['2023/10/06/code-coverage', '2023/10/06/code-coverage-for-unit-tests'],
  [
    '2023/09/30/installing-hms-core-in-as-emulator',
    '2023/09/30/installing-hms-core-in-android-studio-emulator',
  ],
  [
    '2023/09/29/the-better-way-ruby-gems',
    '2023/09/29/the-better-way-with-ruby-gems',
  ],
  [
    '2023/05/12/ng-optimized-image-directive-in-angular-15',
    '2023/05/12/ngoptimizedimage-directive-in-angular-15',
  ],
  [
    '2022/11/16/android-fragment-testing',
    '2022/11/16/android-mobile-testing-fragments',
  ],
  [
    '2022/07/01/ios-mobile-testing-ease-your-life-at-work-with-fastlane',
    '2022/07/01/ease-your-life-at-work-with-fastlane',
  ],
  [
    '2022/06/08/deploying-angular-app-on-azure',
    '2022/06/08/deploying-an-angular-app-on-azure',
  ],
  ['2021/09/10/intro-to-blockchain-react', '2021/09/10/hello-blockchain'],
  [
    '2021/06/16/android-flexible-configuration-with-deferred-resources',
    '2021/06/16/flexible-configuration-with-deferred-resources',
  ],
  [
    '2020/08/14/android-configuration-driven-ui-from-epoxy-to-compose',
    '2020/08/14/configuration-driven-ui-from-epoxy-to-compose',
  ],
  [
    '2020/07/24/building-an-ios14-widget-to-show-account-balance',
    '2020/07/24/building-an-ios-14-widget-to-show-account-balance',
  ],
];

export const postRedirects: Route[] = routes.map(([path, redirectTo]) => ({
  path,
  redirectTo,
}));
