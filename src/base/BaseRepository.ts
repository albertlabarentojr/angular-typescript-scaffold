
module App.Base {
    
    import IRepository = App.Interfaces.Base.IRepository;
    import IRelation = App.Interfaces.Base.IRelation;
    import IRecordSet = App.Interfaces.Response;
    import ICacheRepository = App.Interfaces.Repository;

    export class BaseRepository implements IRepository, ICacheRepository.ICache, ICacheRepository.ICacheable {
        
        allowCache = false;

        recordName : string;

        recordNameReserved : string;

        controllerName : string;

        asController : boolean = false;
        
        Restangular : restangular.IService | any;
        
        baseService : restangular.IService;
        
        results : Array<App.Interfaces.Response.IApiResponseElement> = new Array();

        default_id : string;

        methodName : string;

        private paginateMetas : string[] = ['total', 'per_page', 'current_page', 'last_page', 'next_page_url', 'prev_page_url', 'from', 'to'];

        paginationData : IRecordSet.IApiPagination | any = {};
                
        static $inject : Array<string> = ['Restangular', '$q'];

        $q : ng.IQService;
        
        constructor( Restangular : restangular.IService, $q : ng.IQService, recordName : string, controllerName : string = '') {
            this.Restangular = Restangular;
            this.$q = $q;
            this.recordName = recordName;
            this.recordNameReserved = recordName;
            this.controllerName = controllerName;
        }

        toController = (methodName : string) => {
           this.recordName = this.controllerName+'/'+methodName;;
           this.asController = true;
            return this;
        }

        resetRecordName = () => {}

        toResult = (resp : any) => {
            this.asController = false;
            this.recordName = this.recordNameReserved;
            let respMetas = _.keys(resp[0]);
            
            // test response contains pagination metas
            if(_.intersection(this.paginateMetas, respMetas).length == this.paginateMetas.length) {
                // set pagination data 
                _.each(this.paginateMetas, (meta  : string) => {
                    this.paginationData[meta] = resp[0][meta];
                });
                return resp[0].data;
            }
            return this.Restangular.stripRestangular(resp);
        }

        getAll(params : any = {}) : angular.IPromise<any[]> {
            if(this.allowCache) {
                return this.cache(params).then(this.toResult.bind(this));
            } else {
                return this.Restangular.all(this.recordName).getList(params).then(this.toResult.bind(this));
            }
        }
        
        find = (id : string, params : any = {})  : angular.IPromise<any[]> => {
             return this.Restangular.one(this.recordName, id).get(params).then(this.toResult.bind(this));
        }

        findPopulate = (id : string, repository : IRepository) : angular.IPromise<any[]> => {
            let param : any = {};
                param.populate = repository.recordName;
            return this.Restangular.one(this.recordName, id).get( param ).then(this.toResult.bind(this));
        }

        findWith = (id : string, relations : Array<IRelation>) : restangular.IElement | restangular.IPromise<any[]> => {
            let promise = this.Restangular.one(this.recordName, id);

            _.each(relations, (relation : IRelation) => {
                if( relation.id && relations.length == relations.length - 1) {
                    promise.all(relation.repository.recordName);
                } else {
                    promise = promise.one(relation.repository.recordName, relation.id);
                }
            });
            
            return promise;
        }
        
        update = (id: string, data : IRecordSet.IApiResponseElement) : angular.IPromise<any[]> => {
            return this.Restangular.one(this.recordName, id).put(data).then(this.toResult.bind(this));
        }

        post = (data : any) : angular.IPromise<any[]> => {
            return this.insert(data).then(this.toResult.bind(this));
        }

        updateSeveral (ids : any, params : any = {}) : angular.IPromise<any[]>   {
            return this.Restangular.several(this.recordName, ids).customPUT(params).then(this.toResult.bind(this));
        }

        updateCustom = (id: string, data : IRecordSet.IApiResponseElement) : angular.IPromise<any[]> => {
            return this.Restangular.one(this.recordName, id).customPUT(data).then(this.toResult.bind(this));
        }
        
        insert = (data : IRecordSet.IApiResponseElement) : restangular.IPromise<any[]> => {
            return this.Restangular.all(this.recordName).post(data);
        }

        save(data : IRecordSet.IApiResponseElement) : angular.IPromise<any[]> {
            if(_.has(data, this.default_id))
                return this.updateCustom(data[this.default_id], data);
            else 
                return this.insert(data);
        }
        
        remove(id : string, params : any = {}) : angular.IPromise<any> {
            return this.Restangular.one(this.recordName, id).remove(params).then(this.toResult.bind(this));
        }

        removeSeveral(ids : any, params : any = {}) : angular.IPromise<any[]> {
            return this.Restangular.several(this.recordName, ids).remove(params).then(this.toResult.bind(this));
        }
        
        removeColletion = (queryParams : any) : angular.IPromise<any> => {
            return this.Restangular.one(this.recordName).remove(queryParams).then(this.toResult.bind(this));
        }
        
        cache = (params : any = {}) : angular.IPromise<any> => {
            if(!this.hasResults()){
                return this.Restangular.all(this.recordName).getList(params).then((response : any) => {
                    this.results = response;
                    this.asController = false;
                    return this.results;
                });
            } else {
                return this.$q.resolve( this.results ).then(this.toResult.bind(this));
            }
        }
        
        hasResults = () : Boolean =>  {
            return this.results.length > 0;
        }

        getBaseUrl = ( route : string = '' ) => {
            return `${this.Restangular.configuration.baseUrl}/${this.recordName}/${route}`;
        }

        getBaseControllerUrl = ( controllerName : string, route : string = '' ) => {
            return `${this.Restangular.configuration.baseUrl}/${controllerName}/${route}`;
        }
    }
    
}