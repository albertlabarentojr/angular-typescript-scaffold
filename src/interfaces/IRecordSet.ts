

module App.Interfaces.Response {
    export interface IApiResponseElement {
        id? : any;
        created_at? : any;
        updated_at? : any;
        [propName : string] : any;
    }
    export interface IApiResponse {
        
    }
    export type IApiPagination = {
        total? : number;
        per_page? : number;
        current_page? : number;
        last_page?:number;
        next_page_url?: string;
        prev_page_url?:number;
        from?:number;
        to?:number;
    }
}

module App.Interfaces.Request {
    export interface ApiRequest {

    }
    export interface ApiRequestElement {
        [propName : string] : any;
    }
}