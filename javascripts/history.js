/**
 * Created by arey on 5/5/17.
 */
$(document).ready(function () {
  var id = getUrlParameter('id');

  if(!id){
    alert('Need to provide and id to get the images');
    return;
  }

  new Clipboard('.btn');
  var progressBar = $('.progress');

  jQuery.ajax({
    url: 'https://api.mercadolibre.com/pictures/' + id,
    type: 'GET',
    success: function (data) {
      var variations = data.variations;

      appendResults(variations);
    },
    complete: function () {
      $(progressBar).hide();
    }
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
        toAdd = toAdd + '<div class="col-xs-12 col-sm-4"><div class="panel panel-default"><div class="panel-heading">' + groups[i][j].size + '</div><div class="panel-body"><a href="' + groups[i][j].secure_url + '" class="thumbnail" target="_blank"><img src="' + groups[i][j].secure_url + '"></a></div><div class="panel-footer"><div class="form"><div class="form-group"><div class="input-group"><input id="image_' + i + '_' + j + '_1" type="text" class="form-control" value="' + groups[i][j].secure_url + '"><div class="input-group-addon"><button class="btn btn-default" data-clipboard-target="#image_' + i + '_' + j + '_1"><img src="images/clippy.svg" width="15"  alt="Copy to clipboard"></button></div></div></div></div><div class="form"><div class="form-group"><div class="input-group"><input id="image_' + i + '_' + j + '_2" type="text" class="form-control" value="' + groups[i][j].url + '"><div class="input-group-addon"><button class="btn btn-default" data-clipboard-target="#image_' + i + '_' + j + '_2"><img src="images/clippy.svg" width="15"  alt="Copy to clipboard"></button></div></div></div></div></div></div></div>';
      }

      $('#results').append('<div class="row">' + toAdd + '</div>');
    }
  }

  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }
});