
      // Konum tespiti için JavaScript fonksiyonu
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          alert("Geolocation desteklenmiyor.");
        }
      }

      // KOnumu göstermek için
      function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var myLatLng = { lat: lat, lng: lng };
  
  var map = L.map("map").setView(myLatLng, 8);

  // Harita stilini getirmek için
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
  }).addTo(map);

  // Kişinin konumunu haritada işaretlemek için
  var marker = L.marker(myLatLng).addTo(map);
  marker.bindPopup("<b> Konumunuz </b><br>").openPopup();

  // Tüm fay hatları verileri yüklemek için
  var faultLines = L.geoJSON(null, {
    style: function (feature) {
      return { color: "blue" };
    },
  }).addTo(map);

  // Fay hatları verilerini yüklemek için istek atar
  fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
    .then(function(response) { 
      return response.json();
    })
    .then(function(data) {
      faultLines.addData(data);
      
      // Konum ile en yakın fay hattı arasındaki mesafeyi hesaplar
      var distance = Infinity;
      var closestLine = null;
      var lines = data.features;
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var coords = line.geometry.coordinates;
        for (var j = 0; j < coords.length; j++) {
          var coord = coords[j];
          var d = getDistance(myLatLng.lat, myLatLng.lng, coord[1], coord[0]);
          if (d < distance) {
            distance = d;
            closestLine = line;
          }
        }
      }

      // Mesafeyi h3 etiketi içinde ekranda gösterir
      var distanceText = "Fay hattına uzaklığınız: " + distance.toFixed(2) + " km";
      var distanceElement = document.createElement("h3");
      var distanceTextNode = document.createTextNode(distanceText);
      distanceElement.appendChild(distanceTextNode);
      document.body.appendChild(distanceElement);
    })
    .catch(function(error) {
      console.log("Fay hatları yüklenemedi", error);
    });
}

       function getDistance(lat1, lng1, lat2, lng2) {
       var R = 6371; // Dünya'nın yarıçapı (km)
       var dLat = deg2rad(lat2 - lat1);
       var dLng = deg2rad(lng2 - lng1);
       var a =
       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
       Math.sin(dLng / 2) * Math.sin(dLng / 2);
       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       var d = R * c; // İki nokta arasındaki mesafe (km)
       return d;
    }  

    function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


