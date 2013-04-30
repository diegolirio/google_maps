/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var map = false;
var gmarkers = [];
var IMG_TRUCK = "/tdv_tracking/img/delivery24X24.png";

var tipo = "tdv"; // Tipo do rastreamento (tdv, sascar)

$(function() {
   
   // -------------- Atualizar --------------------------
   $('#atualizar').click(function() {
        //$('#google_maps').ajaxStart(function() { $(this).html('<center><img src="img/Green-004-loading.gif"/></center>'); });
        $('#localizacao_descr').ajaxStart(function() { $(this).html('<img src="img/256.gif"/>'); });
        try {
            
            if($('#select_device').val() == "-1") {
                //$('#content_alert').html('Outra msg de alerta');
                //$('#title_alert').html('Outro titulo de alerta');
                $('#alert_modal').modal('show');
                return false;
            }
            
            $.getJSON('/tdv_tracking/tdv/locations',        // URL 
                      { imei: $('#select_device').val(), tipo: tipo },  // PARAMETROS
                      function(retorno) {                   // REQUISIÇÂO        	  
                                
                                var localizacaoHTML = "";
                                                                
                                if(retorno.returnProc.status == 'N') {
                                
                                        gmarkers = [];          
                                        create_map();

                                        $.each(retorno.listLocal, function(i, local) {                                         
                                                 if(i == 0) {
                                                        $('#last').html('&nbsp;&nbsp;<a href="#" onclick="showLocal2('+i+')" title="Ultima Localização ('+local.latitude+','+local.longitude+')"><img src="/tdv_tracking/img/delivery24X24.png"/></a>&nbsp;<font class="end" size=4>' + local.dataBR + ' - ' + local.endereco + '</font>');
                                                 } else {
                                                        var marker = track(local.latitude, local.longitude, local.dataBR + '<br/>' + local.endereco, G_DEFAULT_ICON);
                                                        gmarkers.push(marker);
                                                        localizacaoHTML += '<p style="font-size: 12px;"><a href="#" onclick="showLocal2('+i+')" title="'+local.latitude+','+local.longitude+'"><img src="img/lupa.png"/></a>&nbsp;' + local.dataBR + ' - ' + local.endereco + '</p><hr/>';
                                                 }                                         
                                        });	
                                        
                                        local(retorno.listLocal[0].latitude, 
                                              retorno.listLocal[0].longitude, 
                                              17, 
                                              retorno.listLocal[0].dataBR + '<br/>' + retorno.listLocal[0].endereco); 

                                        $('#localizacao_descr').ajaxComplete(function() { $(this).html(localizacaoHTML); });
                                } else {
                                    
                                    localizacaoHTML = message_(retorno.returnProc.message); 
                                    
                                    $('#localizacao_descr').ajaxComplete(function() { $(this).html(localizacaoHTML); });
                                    $('#last').empty();
                                    local_load(-23.52164706, -46.5738691, 13, 'Transportes Della Volpe S/A');
                                }

		        }
		);
	} catch(e) {
                alert('Erro ao fazer requisição ao servidor: ' + e.message);
                $('#localizacao_descr').empty();
                $('#google_maps').empty();
	}	
    });	
    // -------------- fim Atualizar --------------------------
    
    // ------- Select Rastreador ----------------------
    $('#select_rastreador').change(function() {
       
       tipo = $(this).val();
       
       if(tipo == "-1") {
           $('#select_device').html('<option value="-1">Selecione o Aparelho</option>');
           return;
       }       
       
       $('#load_devices').ajaxStart(function() { $(this).html('<img src="img/255.gif"/>'); });
        
       $.getJSON('/tdv_tracking/deviceAll',  // URL 
                 { tipo: tipo },             // PARAMETROS
                 function(retorno) {         // REQUISIÇÂO        	  
                     $('#select_device').html('<option value="-1">Selecione o Aparelho</option>');
                     $.each(retorno.devices, function(i, dev) {
                         $('#select_device').html($('#select_device').html()+'<option value="'+dev.imei+'">'+dev.observation+'</option>');
                     });
                     
                     $('#load_devices').ajaxComplete(function() { $(this).empty(); });
                     $('#localizacao_descr').ajaxComplete(function() { $(this).empty(); });
                     //$('#last').ajaxComplete(function() { $(this).empty(); });                   
                 }           
       );         
    });
    // ------- fim Select Rastreador ----------------------
    
    
    $('.over').mouseover(function() {
            $(this).css('background', '#F0F8FF'); 
    }).mouseout(function() {
            $(this).css('background', 'none');
    });	  
    
    $('#select_rast_all').change(function(){

        
        if($('#select_rast_all').val() == -1) {
            $('#tbody_devs').html(''); 
            $('#loc_view').html('');
            local_load(-23.52164706, -46.5738691, 13, 'Transportes Della Volpe S/A');                          
            return;
        }        
        
        $('#change_last_all').ajaxStart(function() { $(this).html('<img src="/tdv_tracking/img/255.gif"/>'); });
        
        $.getJSON('/tdv_tracking/devices_last_position', 
                  {tipo: $(this).val()}, 
                  function(retorno) {
                      
                      var tb = "";
                      var lv = "<br/><br/>";
                      
                      if(retorno.returnProc.status == 'N') {
                          
                          gmarkers = []; 
                          
                          $.each(retorno.listLocal, function(i, l) {
                              
                              tb += '<tr>' +
                                        '<td>'+l.device.imei+'</td>'+
                                        '<td>'+l.device.observation+'</td>'+
                                        '<td>'+l.latitude+'</td>'+
                                        '<td>'+l.longitude+'</td>'+
                                        '<td>'+l.dataBR+'</td>'+
                                        '<td>'+l.endereco+'</td>'+
                                        '<td><a href="#google_maps" onclick="showLocal2('+i+')" title="'+l.latitude+','+l.longitude+'"><img src="'+IMG_TRUCK+'"/></a></td>'+
                                   '<tr>';
                                       
                               lv += '<p><a href="#google_maps" onclick="showLocal2('+i+')" title="'+l.latitude+','+l.longitude+'"><img src="'+IMG_TRUCK+'"/></a>) '+l.device.observation+'</p>';
                                       
                               if(i == 0) {
                                    local(l.latitude, 
                                          l.longitude, 
                                          17, 
                                          l.device.observation + " - " + l.endereco); 
                               } else {
                                    var marker = track(l.latitude, l.longitude, l.device.observation + '<br/>' + l.dataBR + '<br/>' + l.endereco, IMG_TRUCK);
                                    gmarkers.push(marker);
                               }                                         
                               
                          });
                      } else {
                          //alert(retorno.returnProc.message);
                          tb = message_(retorno.returnProc.message);
                          local_load(-23.52164706, -46.5738691, 13, 'Transportes Della Volpe S/A');
                      }
                      $('#tbody_devs').html(tb); 
                      $('#loc_view').html(lv);
                      
                      $('#change_last_all').ajaxComplete(function() { $(this).empty(); });
                  }
              );
        
    });
    
    $('#atualizar_last_all').click(function() {
       $('#select_rast_all').trigger("change");
    });
    

});

function message_(message) {
    var msg = '<div class="alert alert-block"><a class="close">&times;</a>' +
              '  <p>'+message+'</p>' +
              '</div>';   
    return msg;                      
}

function create_map() {
    
    map = new GMap2(document.getElementById("google_maps"));
    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.addControl(new GOverviewMapControl());        
}

function local_load(latitude, longitude, zoom, endereco) {
    create_map();
    local(latitude, longitude, zoom, endereco);
}

function local(latitude, longitude, zoom, endereco) {
    
        try {
                var local = new GLatLng(latitude, longitude);
                
                map.setCenter(local, zoom);

                var icon = new GIcon(G_DEFAULT_ICON);                
                icon.image = IMG_TRUCK;

                //var markerss = new GMarker(new GLatLng(latitude, '-47,32645645'));

                var marker = new GMarker(local, icon);

                GEvent.addListener(marker, 
                                   'mouseover', 
                                   //'click', 
                                   function() {
                                       marker.openInfoWindowHtml("<font face=arial color=blue>" + endereco + "</font>");
                                   });	
                gmarkers.push(marker);
                map.addOverlay(marker);
                //map.addOverlay(markerss);
                //document.getElementById("imei").focus();
        } catch(e) {
                alert('Erro ao pegar local atual: ' + e);
        }
}

function track(latitude, longitude, endereco, img) {

        var icon = new GIcon(G_DEFAULT_ICON);
        if (img != G_DEFAULT_ICON) {
            icon.image = img;
        }
        var marker = new GMarker(new GLatLng(latitude, longitude), icon);
        
        try {
                GEvent.addListener(marker, 
                                   'mouseover',  
                                   function() {
                                         marker.openInfoWindowHtml("<font face=arial color=blue>" + endereco + "</font>");
                                   });  
                //gmarkers.push(marker);
                map.addOverlay(marker);
        } catch(e) {
                alert('Erro ao Pegar Caminho: ' + e);
        }
        return marker;
}

function showLocal(latitude, longitude) {
        map.setCenter(new GLatLng(latitude, longitude), 13);
}

function showLocal2(index) {
        GEvent.trigger(gmarkers[index], "mouseover");
}


