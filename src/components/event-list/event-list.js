import template from './event-list.html';
import styles from './event-list.scss';

export default {
  template,
  bindings: {
    // userIdentity: '<',
    ckqueryResult: '=',
    dbType: '<',
    publish: '&',
  },
  controller: ['ckqueryService', 'ckconfigureService', '$scope', 'ckauthenticateService', controller]
};

function controller(ckqueryService, ckconfigureService, $scope, ckauthenticateService){
  this.styles = styles;

  if (this.ckqueryResult.error) {
    if (this.ckqueryResult.error.message === 'Cannot query against an unauthenticated user ID'){
      //TODO: Show message that user needs to be logged in.
      console.log('Unauthenticated, user not logged in');
    }else{
      //TODO: Show generic server error message
    }
  }

  // Get inital value of name
  ckauthenticateService.fetchCurrentName()
  .then(name => this.userName = name);

  // Observer changes to state of authentication
  ckauthenticateService.subscribe( userIdentity => {
    $scope.$apply( () => {
      // this.userName = 'testerset'
      this.userName = userIdentity || '';
    });
  });

  this.loadMore = function loadMore(){
    ckqueryService.query(
      'PUBLIC','_defaultZone',null,'Program',
      ['title', 'imageRef', 'video'],'title',null,null,null,
      [], this.ckqueryResult.continuationMarker
    ).then(result => {
      this.ckqueryResult.records = this.ckqueryResult.records.concat(result.records);
      this.ckqueryResult.continuationMarker = result.continuationMarker;
      $scope.$apply();  // Forces Angular to evalute any $watchers
    }).catch(error => {
      console.log('loadMore error ' + error);
    });
  };

  this.remove = function remove(rec){
    let index = this.ckqueryResult.records.findIndex( element => element.recordName === rec.recordName );
    if (index > -1) {
      this.ckqueryResult.records.splice(index, 1);
      $scope.$apply();
    }
  };

}
