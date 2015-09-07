$( document ).ready(function() {
  $.ajax({
    url  : 'http://localhost:8080',
    type : 'GET'
  }).done(function(data, statusText, xhr){
    console.log('server ok');
    $('#btn').click(function(evt) {
      app.reloadMarkers();
    });
  }).always(function(data, statusText, xhr){
    var status = xhr.status;
    if (status != 200) {
      $('body').append('Server is down :(');
    }
  });
});

var app = {
  markers: [],
  map: null,
  myLatLng: [],
  initMap : function() {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        app.myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
        app.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: app.myLatLng
        });

        app.map.dragInProgress = false;
        google.maps.event.addListener(app.map, 'dragend', function(){
          if(app.map.dragInProgress === false){
            app.map.dragInProgress = true;
            window.setTimeout(function(){
              app.myLatLng = {lat:app.map.getCenter().G, lng:app.map.getCenter().K};
              console.log(app.map.getCenter());
              app.map.dragInProgress = false;
              app.reloadMarkers();
            }, 1000);
          }
        });

        //app.loadMyPosition();
        app.loadNearPlaces();
      },
      function () {
        console.error('Your browser does not support geolocation, sorry!');
      }
    );

  },

  clearMarkers: function() {
    for (var i = 0; i < app.markers.length; i++ ) {
      app.markers[i].setMap(null);
    }
    app.markers.length = 0;
  },

  reloadMarkers: function () {
      app.clearMarkers();
      //app.loadMyPosition();
      app.loadNearPlaces();
  },

  loadMyPosition: function() {
    app.addMarker(app.myLatLng, 'Hey, I am here!!');
  },

  addMarker : function(myLatLng, _title) {
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: app.map,
        title: _title
      });
      app.markers.push(marker);
  },

  loadNearPlaces : function() {
    var url = "http://localhost:8080/places/near/"+app.myLatLng.lat+"/"+app.myLatLng.lng+"/"+$('input#distance').val();
    console.log(url);
    $.get(url, function(data, status){
      $.each(JSON.parse(data).results, function( index, value ) {
        console.log(JSON.stringify(value.obj));
        app.addMarker(
          {lat: value.obj.loc[0], lng: value.obj.loc[1]},
          value.obj.placename + ' (Distance from the center: ' + parseInt((value.dis * 1000)) + ' meters)'
        );
      });
    });
  }
};
