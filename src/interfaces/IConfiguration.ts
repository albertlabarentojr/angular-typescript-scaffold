/// <reference path="../../typings/tsd.d.ts" />

module App.Config {

    export module Angular {
        export interface Module {
            name : string;
            dependencies : Array<string>;
        }
    }

    export interface Templates {
        guest_header? : string;
        member_header? : string;
    }

    export interface Modules {
        LOGIN : string;
        LOGOUT : string;
        PROFILE : string;
    }
    
    export interface IAngular {
        module : App.Config.Angular.Module;
        templates? : Templates;
        modules? : Modules;
    }

    export interface Roles {
        guest : string[];
        member : string[];
    }

    export interface Redirects {
        member : string;
        guest : string;
    }

    export interface ACL {
        roles : Roles,
        redirects : Redirects
    }
}

