/// <reference path="../../typings/tsd.d.ts" />

module App.Interfaces.Base {
    
    import IRecordSet = App.Interfaces.Response;

    export interface IBaseController {
        defineScope?() : void;
        defineListeners?() : void;
        destroy?() : void;
    }
    
    export interface IController {
        $scope : angular.IScope;
        $rootScope : angular.IRootScopeService;
    }

    export interface IRelation {
        repository : IRepository;
        id? : number;
    }
    
    export interface IRepository {
        recordName : string;
        getAll() : angular.IPromise<any[]>;
        find(id : string, params : any) : angular.IPromise<any[]>;
        update(id : string, data : IRecordSet.IApiResponseElement) : angular.IPromise<any[]>;
        insert(data : IRecordSet.IApiResponseElement) : angular.IPromise<any[]>;
        remove(id : string) : angular.IPromise<any[]>;
        findWith(id : string, relations : Array<IRelation>) : restangular.IElement | angular.IPromise<any[]>;
        hasResults() : Boolean;
    }
    
    export interface IService {
        results : IRecordSet.IApiResponse;
    }
}