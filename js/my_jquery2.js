/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var map = false;
var markes = false;

function create_map() {
  var myLatlng = new google.maps.LatLng(-23.52164706, -46.5738691);
  var mapOptions = {
    zoom: 10,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById("google_maps"), mapOptions);    
  
    var location = new google.maps.LatLng(-23.52164706, -46.5738691);  
    var location2 = new google.maps.LatLng(-23.62164706, -46.5738691);
   
    var marker = new google.maps.Marker({
            position: location,
            map: map
        });  
        
    var infowindow = new google.maps.InfoWindow(
          { content: 'Teste',
            size: new google.maps.Size(50,50)
          });
          
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);        
      });
      
    var info2 = new google.maps.InfoWindow( {
       content: 'Info2', size: new google.maps.Size(100, 100) 
    });
      
    var marker2 = new google.maps.Marker({
            position: location2,
            map: map
        });     
    
    google.maps.event.addListener(marker2, 'click', function() {
        info2.open(map, marker2);
    });
        
    markes.push(marker);
    markes.push(marker2);
  
}

