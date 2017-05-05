/**
 * Created by arey on 5/5/17.
 */
$(document).ready(function () {
  loadHistory();

  $('#image-uploader').submit(function (event) {
    event.preventDefault();

    var progressBar = $(this).find('.progress')[0];
    var accessToken = $(this).find('input[name=access_token]')[0];
    var imageInput = $(this).find('input[name=picture]')[0];

    if (!accessToken) {
      alert('Acess Token is required');
      return;
    }

    if (imageInput.files.length === 0) {
      alert('You need to upload at least 1 image');
      return;
    } else if (imageInput.files.length > 1) {
      alert('You need to upload only 1 image per upload');
      return;
    }

    var data = new FormData();
    var toUpload = imageInput.files[0];

    data.append('file', toUpload);

    $(progressBar).show();

    jQuery.ajax({
      url: 'https://api.mercadolibre.com/pictures?access_token=' + accessToken.value,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function (data) {
        var variations = data.variations;

        appendResults(variations);
        saveOnHistory(data.id);
      },
      complete: function () {
        $(progressBar).hide();
      }
    });
  });

  function appendResults(images) {
    var groups = [];
    var temp = [];

    for (var i = 0; i < images.length; i++) {
      if (temp.length < 3) {
        temp.push(images[i]);
      } else if (temp.length === 3) {
        groups = groups.concat([temp]);
        temp = [images[i]];
      }
    }

    for (var i = 0; i < groups.length; i++) {
      var toAdd = '';

      for (var j = 0; j < groups[i].length; j++) {
        toAdd = toAdd + '<div class="col-xs-4"><div class="panel panel-default"><div class="panel-heading">' + groups[i][j].size + '</div><div class="panel-body"><a href="' + groups[i][j].secure_url + '" class="thumbnail" target="_blank"><img src="' + groups[i][j].secure_url + '"></a></div><div class="panel-footer"><div><a href="' + groups[i][j].secure_url + '" target="_blank">Secure</a></div><div><a href="' + groups[i][j].url + '" target="_blank">Not Secure</a></div></div></div></div>';
      }

      $('#results').append('<div class="row">' + toAdd + '</div>');
    }
  }

  function saveOnHistory(id) {
    var history = store.get('history');

    if (history) {
      history.push(id);

      store.set('history', history);
    } else {
      store.set('history', [id]);
    }
  }

  function loadHistory() {
    var history = store.get('history');

    if (history) {
      for(var i = (history.length - 1); i >= 0; i--){
        console.log(i)
        $('#history tbody').append('<tr><td>' + history[i] + '</td><td><a href="history.html?id=' + history[i] + '">Ver Imagenes</a></td></tr>');
      }

      $('#history').show();
    }
  }
});