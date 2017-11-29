

module App.Interfaces.Repository {
    
    export interface ICacheable {
        allowCache : boolean;
    }
    
    export interface ICache {
        cache(callback : restangular.ICollectionPromise<any[]>) : angular.IPromise<any>;
    }    
}