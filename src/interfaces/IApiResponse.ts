
module App.Interfaces {

    export interface NotificationData {
        type : string;
        notification : string;
    }

    export interface IApiData {
        message : string | any[] | NotificationData;
        success : boolean;
    }

    export interface IApiResponse {
        config : any;
        data : IApiData;
        status : number;
        statusText : string;
    }
}