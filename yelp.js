var coords = [];
var mycoordinates = {lat: 32.75, lng: -97.13};
var zooom = 16;
var mar;
var markers = [];

function initialize ()
 {
  mar = new google.maps.Map(document.getElementById('map'), {zoom: zooom, center: mycoordinates});
  document.getElementById("o").innerHTML="";

 }
function sendRequest () {
 clearMarkers();
 document.getElementById("o").innerHTML="";
 var bounds = mar.getBounds();
 var southWest_lat = bounds.getSouthWest().lat();
 var southWest_lng = bounds.getSouthWest().lng();
 var northEast_lat = bounds.getNorthEast().lat();
 var northEast_lng = bounds.getNorthEast().lng();
 //var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(southWest_lat, southWest_lng), new google.maps.LatLng(northEast_lat, northEast_lng)); 
 var query = encodeURI(document.getElementById("search").value).trim();
 //console.log(distance);
 var replacesearch = query.split(' ').join('+');
 var xhr = new XMLHttpRequest();
 xhr.open("GET", "proxy.php?term="+replacesearch+"&latitude="+southWest_lat+"&longitude="+northEast_lng+"&radius=3000&limit=10");
 xhr.setRequestHeader("Accept","application/json");
 xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          var obj = eval("("+str+")");
          var temp;
          displayresult(json);
          for (i=0;i<json.businesses.length;i++)
          {
            console.log(json.businesses[i]["coordinates"]);
            lat1 = json.businesses[i]["coordinates"]["latitude"];
            long = json.businesses[i]["coordinates"]["longitude"];
            name = i;
            setMarkers(lat1,long,name);
          }
       }
   };
   xhr.send(null);
}

function setMarkers(lat1,long,name)
{
var coord_here = {lat:lat1,lng:long};
var marker = new google.maps.Marker({position:coord_here, map: mar, label: name});
markers.push(marker);
}

function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

 function clearMarkers() {
        setMapOnAll(null);
        markers = [];
      }

function displayresult(json)
{
 if (json.businesses.length < 1)
 {
  document.getElementById("o").innerHTML = "<pre>No restaurants of your search kind exsists in this area given</pre>"
 }
 else
 {
 for (i = 0; i< json.businesses.length; i++)
 {
  var name = '<a href="' + json.businesses[i].url
          + '" style="text-decoration:none;">'
          + json.businesses[i].name + '</a>';
  var image = '<img alt="No Image" style="width:30%; height:30%;" src="'
          + json.businesses[i].image_url + '">';
  var rating = json.businesses[i]["rating"];
  document.getElementById("o").innerHTML += "<pre>"+name+"<br>"+image+"<br> Rating = "+rating+"</pre>";
 }
}
}
 
function clearRequest()
{
document.getElementById("search").value = " ";
}