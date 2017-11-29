/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces/IAppConstants.ts" />

let angularModule = angular.module(App.Config.Ng.module.name, App.Config.Ng.module.dependencies);

declare let namespace : any;
declare let moment : any;

module App.Main {

    import AppConfig = App.Config;
    import Interfaces = App.Interfaces;
    import IConstants = Interfaces.Constants;

    export interface Bod4RentConstants extends IConstants.AppConstants {
        mainTemplateUrl? : string;
        resource_path? : string;
        timeZone? : string;
        dateTimeFormat? : string;
        dateFormatStore? : string;
        dateTimeFormatStore? : string;
        defaultLocale? : string;
        default_profile_picture? : string;
    }

    const AppConstants = (() : IConstants.AppConstants => {
        function makeApiUrl( appEnv : string, apiCons : any, protocol : any) : string {
            let apiObj =  apiCons[appEnv];
            return `${protocol}${apiObj.url}/${apiObj.version}`;
        }

        function makeBaseUrl(protocol : string, baseUrl : string) : string {
            return `${protocol}${baseUrl}`;
        }

        let cons : Bod4RentConstants;
            cons = AppConfig.Variables;
            cons.baseUrl = makeBaseUrl(cons.protocol, cons.baseUrl); 
            cons.baseClientUrl = makeBaseUrl(cons.protocol, cons.baseClientUrl); 
            cons.apiUrl = makeApiUrl( cons.environment, cons.api, cons.protocol);
            cons.userToken = '_token';
            cons.userKey = 'user';
            cons.mainTemplateUrl = cons.modulesTemplateUrl+'_main/templates/';
            cons.resource_path = `${cons.basePath}common/resources/`;
            cons.default_profile_picture = `${cons.resource_path}default_profile_picture.png`;
            cons.dateFormat = 'DD-MM-YYYY';
            cons.dateFormatStore = 'YYYY-MM-DD';
            cons.dateTimeFormatStore = 'YYYY-MM-DD HH:mm:ss';
            cons.dateTimeFormat = 'DD-MM-YYYY HH:mm:ss';
            cons.timeZone = 'UTC';
            cons.defaultLocale = 'no';
            return cons;
    })();

    function Config(
        $urlRouterProvider : ng.ui.IUrlRouterProvider , 
        $stateProvider : ng.ui.IStateProvider, 
        AppConstants : App.Main.Bod4RentConstants, 
        $ocLazyLoadProvider : any,
        angularPromiseButtonsProvider : any,
        RestangularProvider : restangular.IProvider,
        $translateProvider : any,
        $locationProvider : any,
        $provide : any
        ){

        let templatePath = AppConstants.modulesTemplateUrl+'_main/templates/';
        
        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

        // RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        //      if (data.hasOwnProperty("data"))
        //         return data.data;
        //     return data;
        // });
        // $provide.decorator('$sniffer', function($delegate) {
        //     $delegate.history = false;
        //     return $delegate;
        //   });
        $urlRouterProvider.otherwise( function( $injector : any) {
            var $state = $injector.get("$state");
            $state.go( App.Config.Acl.redirects.guest );
        });


        $stateProvider.state('main', {
            abstract: true,
            url: `/${AppConstants.appAlias}`,
            templateUrl: `${templatePath}content.html`,
            controller : 'MainController',
            controllerAs : 'mainCtrl'
        });

        angularPromiseButtonsProvider.extendConfig({
            spinnerTpl: '<i class="fa pull-left fa-spinner fa-spin fa-1x fa-fw"></i>',
            disableBtn: true,
            btnLoadingClass: 'is-loading',
            addClassToCurrentBtnOnly: false,
            disableCurrentBtnOnly: false
        });

        $translateProvider.useStaticFilesLoader({
            prefix: `${AppConstants.languagePath}`,
            suffix: '.json'
        });

        // $locationProvider.html5Mode(true);
    }


    Config.$inject = [
        '$urlRouterProvider', 
        '$stateProvider', 
        'AppConstants', 
        '$ocLazyLoadProvider', 
        'angularPromiseButtonsProvider', 
        'RestangularProvider', 
        '$translateProvider',
        '$locationProvider',
        '$provide'
    ];

    function Init(
        Restangular:restangular.IService, 
        $q : any, 
        $http : any, 
        AppConstants : App.Main.Bod4RentConstants,
        $state : any,
        $rootScope : any,
        AuthService : App.Services.AuthService,
        $translate : any,
        $templateCache : ng.ITemplateCacheService,
        AclAuth : App.Services.AclAuth,
        Notifications : App.Base.EventDispatcher,
        $location : any
        ) 
        {
            
        Restangular.setBaseUrl(AppConstants.apiUrl);

        let templatePath = AppConstants.modulesTemplateUrl+'_main/templates/';
        
        $rootScope.mainTemplateUrl = templatePath;
        $rootScope.modulesTemplateUrl = AppConstants.modulesTemplateUrl;
        $rootScope.AppName = AppConstants.appAlias;
        $rootScope.baseUrl = AppConstants.baseUrl;
        $rootScope.baseClientUrl = AppConstants.baseClientUrl;
        $rootScope.resource_path = AppConstants.resource_path;
        $rootScope.$state = $state;
        $rootScope.footerTpl = AppConstants.footerTplUrl;
        $rootScope.gPlacesOptions = {
            componentRestrictions: { country: 'no' }
        };

        let begin = moment().isoWeekday(1);
        begin.startOf('week');
        // set roles and permissions
        AclAuth.setRoles();

        // set user if authenticated
        if( AuthService.isAuthenticated() ){
            AuthService.setUser();
            // if user has no profile
            
        } 

        Restangular.setErrorInterceptor((response) => {
            if (response.hasOwnProperty("data"))
                 if(response.data.message == 'TOKEN_EXPIRED')
                    Notifications.notify('ERROR.TOKEN_EXPIRED');
        });
        
        Restangular.addFullRequestInterceptor((element : any, operation : string, what : string, url : string, headers : any, params : any, httpConfig : ng.IRequestShortcutConfig) => {
            // Bearer token for authenticated user for every request
            if( AuthService.isAuthenticated() )
                headers['Authorization'] = 'Bearer '+AuthService.getToken();
            if( AuthService.isAdmin() )
                headers['AutorizationUserID'] = $rootScope['user'].id;

            return {
                headers : headers,
                params : params,
                element : element,
                httpConfig : httpConfig
            }

        });

        Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            if (data.hasOwnProperty("data"))
               return Restangular.stripRestangular(data.data);
           return data;
       });
        // $rootScope.$on('$viewContentLoaded', function() {
        //     $templateCache.removeAll();
        // });

        let views = [ 'main', 'account' ];
        $rootScope.$on('$stateChangeStart', function (event : any, toState : any, current : any) {
            $rootScope['pageTitle'] = toState.data.pageTitle;
            // if (typeof (current) !== 'undefined') {
            //     _.each( views, ( view : string ) => {
            //         if( _.has( toState.views, view ) ){
            //             $templateCache.remove(toState.views[view].templateUrl);
            //         }
            //     });+
            // }
        });

        $rootScope.$on('$stateChangeSuccess', function (event : any, toState : any) {
            window['dataLayer'].push({
                event: 'pageView',
                action: $location.url(),
            });

            window['ga']('set', 'page', $location.url());
            window['ga']('send', 'pageview', { page : $location.url() });
            console.log($location.url());
        });

        $translate.use(AppConstants.defaultLocale);
    }

     Init.$inject = ['Restangular', '$q', '$http', 'AppConstants', '$state', '$rootScope', 'AuthService', '$translate', '$templateCache', 'AclAuth', 'Notifications', '$location' ];

    
    angularModule
        .config(Config)
        .run(Init)
        .constant('AppConstants', AppConstants);

    // filters temp 
     angularModule.filter('utc', [function() {
        return function(date : any) {
        if(angular.isNumber(date)) {
            date = new Date(date);
        }
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }   
    } ]);
}