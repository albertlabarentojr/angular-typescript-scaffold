
/// <reference path="../interfaces/IBase.ts" />


module App.Base {
    
        import Base = App.Interfaces.Base;
        import Interfaces = App.Interfaces;
    
        /** 
         * App Base Controller
         */
        export class BaseController implements Base.IBaseController, Base.IController {
    
            $scope : angular.IScope | any;
    
            $rootScope : angular.IRootScopeService;
    
            errorBags : string[] = [];
    
            successBags : string[] = [];
    
            isLoading : boolean = true;
    
            constructor( 
                $scope : ng.IScope,
                $rootScope : ng.IRootScopeService
             ) {
                 this.$scope = $scope;
                 this.$rootScope = $rootScope;
             }
    
             defineListeners = () => {
                 this.$scope.$on( '$destroy', this.destroy.bind(this) );
             }
    
             destroy = () => {
                 
             }
    
             errorTranslate = (error : Interfaces.IApiResponse) : string[] => {
                 if(_.has(error.data, 'message')){
                    return _.filter(_.split(error.data.message, '.'), function(eitem : any) {
                        return eitem.length > 0;
                    });
                 } else {
                     return this.errorTranslateGeneric(error);
                 }
             }
    
             errorTranslateGeneric = (error : any) => {
                if(_.values(error.data).length > 30){
                    return ['01_ERROR_SERVER'];
                }
    
                return _.concat(_.join(_.values(error.data), ', '));
             }
    
            _handleSuccess( response? : Interfaces.IApiResponse ){
                this.errorBags = [];
            }
    
             _handleOnError( error : Interfaces.IApiResponse ){
                this.errorBags = this.errorTranslate( error );
            }
    
            loading = () => {
                this.isLoading = true;
            }
    
            ready = () => {
                this.isLoading = false;
            }
    
            checkInputs = ( selected : any[] ) => {
                return _.keys(_.pickBy(selected, ( value : any, key : any ) => {
                    return value;
                }));
            }
    
            checkInputModel = ( selected : any[] ) => {
                console.log(selected);
            }
        }
    
    }