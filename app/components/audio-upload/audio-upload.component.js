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

  function audioUploadController($mdToast, UserService, FileUploader, BoardAudiosService) {
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
          BoardAudiosService.addAudio(response);
          $mdToast.show($mdToast.simple().textContent('Audio Added!'));
        },
        onErrorItem: (fileItem, response, status, headers) => {
          console.error('error: ', response);
          console.info('fileItem: ', fileItem);
        }
      });
    }

  }

})();
