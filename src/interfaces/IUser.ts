module App.Interfaces.User {
    export interface User {
        id? : string;
        created_at? : any;
        updated_at? : any;
    }

    export interface IUserAuthenticated extends User {
        _token? : string;
        [param : string] : any;
    }
}