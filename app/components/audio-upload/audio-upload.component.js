(function () {

  angular
    .module('mysoundboard')
    .component('audioUpload', {
      controller: audioUploadController,
      templateUrl: 'audio-upload/audio-upload.html',
      bindings: {
        user: '='
      }
    });

  function audioUploadController(UserService, FileUploader) {
    const vm = this;

    vm.uploader = getUploader();

    /////////////////

    function getUploader() {
      return new FileUploader({
        url: '/api/music',
        headers: {
          ContentType: 'application/json'
        },
        onBeforeUploadItem: (item) => {
          item.formData.push({
            user: UserService.user.data.uid,
            size: item.file.size
          });
          console.log(item);
        },
        onSuccessItem: (fileItem, response, status, headers) => {
          console.info('onSuccessItem', fileItem, response, status, headers);
        },
        onErrorItem: (fileItem, response, status, headers) => {
          console.error('error: ', response);
          console.info('fileItem: ', fileItem);
        }
      });
    }

  }

})();
