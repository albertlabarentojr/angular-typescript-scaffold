module App.Config {
    
    export const Variables : App.Interfaces.Constants.AppConstants = {
            appName : 'appName',
    
            appAlias : 'App Alias',
    
            environment : 'development',
    
            protocol : 'http://',
    
            baseUrl : 'appName-api.dev.com',
    
            api : {
                    development : {
                    url : 'appName-api.dev.com',
                    version : 'v1'
                },
                    production : {
                        url : 'appName-api.prod.com',
                        version : 'v1'
                }
            },
    
            basePath : './src/',
    
            modulesTemplateUrl : './src/modules/'
        }
    }