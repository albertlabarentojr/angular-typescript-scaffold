/// <reference path="../../typings/tsd.d.ts" />

declare let _ : any;

module App.Config {

    export const Ng : App.Config.IAngular = {
        module : {
            name : 'module_name',
            dependencies : [
            ]
        }
    }

    export const Acl : App.Config.ACL = {
        roles : {
            guest : [ 
                Ng.modules.LOGIN, 
            ],
            member : [
                Ng.modules.PROFILE
            ]
        },
        redirects : {
            member : 'main.home',
            guest : 'main.home'
        }
    }

}