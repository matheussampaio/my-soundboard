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

    vm.fab = {
      open: false
    };

    vm.uploader = getUploader();

    /////////////////

    function getUploader() {
      return new FileUploader({
        url: '/api/audio',
        headers: {
          ContentType: 'application/json'
        },
        onBeforeUploadItem: (item) => {
          item.formData.push({
            title: 'audio',
            user: UserService.data.uid,
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
