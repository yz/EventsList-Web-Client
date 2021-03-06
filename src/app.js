import angular from 'angular';
import router from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import components from './components';
import services from './services';
import directives from './directives';
import 'angular-ui-router/release/stateEvents';
import ngDialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';
import ngAnimate from 'angular-animate';

const app = angular.module('app', [
  router,
  ngCookies,
  angular.module( 'ui.router.state.events' ).name,
  ngDialog,
  components,
  services,
  directives,
  ngAnimate
]);

export default app;
