import template from './event-list.html';
import styles from './event-list.scss';

export default {
  template,
  bindings: {
    ckqueryResult: '=',
    dbType: '<',
    publish: '&',
    userName: '<'
  },
  controller: ['ckqueryService', 'ckconfigureService', '$scope', controller]
};

function controller(ckqueryService, ckconfigureService, $scope){
  // ============================== Properties ============================== //
  this.styles = styles;

  // =============================== Methods ================================ //
  this.loadMore = loadMore;
  this.remove = remove;

  // ============================ Initialization ============================ //
  this.$onInit = () => {
    if (this.ckqueryResult.error) {
      if (this.ckqueryResult.error.message === 'Cannot query against an unauthenticated user ID'){
        //TODO: Show message that user needs to be logged in.
        console.log('Unauthenticated, user not logged in');
      }else{
        //TODO: Show generic server error message
      }
    }
  };

  // ======================== Function declarations ========================= //
  /**
   * Loads next batch of events to the screen.
   */
  function loadMore(){
    ckqueryService.query(
      this.dbType,'_defaultZone',null,'Program',
      ['title', 'imageRef', 'video'],'title',null,null,null,
      [], this.ckqueryResult.continuationMarker
    ).then(result => {
      this.ckqueryResult.records = this.ckqueryResult.records.concat(result.records);
      this.ckqueryResult.continuationMarker = result.continuationMarker;
      $scope.$apply();
    }).catch(error => {
      console.log('loadMore error ' + error);
    });
  };

  /**
   * Update the list of events in the current UI. Note, it does NOT delete
   * a record from cloud store.
   *
   * @param  {Object} rec  An event record.
   */
  function remove(rec){
    let index = this.ckqueryResult.records.findIndex( element => element.recordName === rec.recordName );
    if (index > -1) {
      this.ckqueryResult.records.splice(index, 1);
      $scope.$apply();
    }
  };

}
