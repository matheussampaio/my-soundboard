(function () {

  angular.module('mysoundboard')
    .run(mysoundboardRun)
    .config(mysoundboardConfig);

  function mysoundboardRun($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {
      if (toState.auth && !$rootScope.user) {
        event.preventDefault();
        $state.go('app.login');
      }
    });
  }

  function mysoundboardConfig($stateProvider, $urlRouterProvider, hotkeysProvider) {
    hotkeysProvider.includeCheatSheet = false;

    const appState = {
      url: '/',
      abstract: true,
      template: '<app></app>'
    };

    const homeState = {
      url: 'home',
      template: '<home></home>'
    };

    const loginState = {
      url: 'login',
      template: '<login></login>'
    };

    const registerState = {
      url: 'register',
      template: '<register></register>'
    };

    const dashboardState = {
      url: 'dashboard',
      template: '<dashboard></dashboard>'
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.login', loginState)
        .state('app.register', registerState)
        .state('app.dashboard', dashboardState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
