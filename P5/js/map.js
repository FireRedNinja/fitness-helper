      function initMap() {
        var location = {lat: 56.0697261, lng: -3.4651374};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: location,
          disableDefaultUI: true
        });
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
      }