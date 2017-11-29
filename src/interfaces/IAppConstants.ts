/// <reference path="./IConfiguration.ts" />

module App.Interfaces.Constants {
    
    import Configs = App.Config;

    type Environment = 'development' | 'production';

    export interface RestApiEnvElem {
        url : string;
        version : string;
    }

    export interface RestApiEnv {
        development : RestApiEnvElem;
        production : RestApiEnvElem;
    }

    export interface AppConstants {
        environment : Environment;
        baseUrl : string;
        baseClientUrl : string;
        protocol : string;
        localApi? : string;
        appName? : string;
        appAlias? : string;
        apiUrl? : string;
        api : App.Interfaces.Constants.RestApiEnv;
        modulesTemplateUrl? : string;
        basePath? : string;
        userToken? : string;
        userKey? : string;
        languagePath? : string;
        [props : string] : any; 
    }
    
    export interface ModuleRoutes{
        title : string;
        date_last_accessed? : Date;
    }

    export interface ModuleConstants {
        templateUrl : string;
        states? : Array<ModuleRoutes>;
        [props : string] : any; 
    }
}