import template from './event-add.html';
import styles from './event-add.scss';

export default {
  template,
  bindings:{
    add: '&',
    close: '&'
  },
  controller: ['ckrecordService', '$scope', 'Program', controller]
};

function controller(ckrecordService, $scope, Program){
  // ============================== Properties ============================== //
  this.styles = styles;
  this.formtitle = '';
  this.formvideo = '';

  // ================================ Methods =============================== //
  this.submit = submit;

  // ========================= Function declarations ======================== //
  /**
   * Creates Program model object using form data and saves as a new cloud store
   * record.
   */
  function submit(){

    if (!this.formtitle) return;
    const obj = Program.createWithTitle(this.formtitle).toObject();

    if (this.formvideo){
      obj.fields.video = {value: this.formvideo, type: 'STRING'};
    }

    ckrecordService.save(
      'PRIVATE',      // cdatabaseScope, PUBLIC or PRIVATE
      null,           // recordName,
      null,           // recordChangeTag
      'Program',      // recordType
      null,           // zoneName,  null is _defaultZone, PUBLIC databases can only be default
      null,           // forRecordName,
      null,           // forRecordChangeTag,
      null,           // publicPermission,
      null,           // ownerRecordName,
      null,           // participants,
      null,           // parentRecordName,
      obj.fields      // fields
    ).then( record => {
      // Save new value
      this.formtitle = '';
      this.formvideo = '';
      $scope.$apply();
      this.add( {rec: new Program(record)} );
      this.close();
    }).catch((error) => {
      // Revert to previous value
      console.log('addition ERROR', error);
      //TODO: Show message when current user does not have permission.
      // error message will be: 'CREATE operation not permitted'
    });

  };

}
