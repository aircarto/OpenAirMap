
var date = new Date();
var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
var api_key_atmo = "21d3ca8d59e93e7cee170cb388858ba4";


// ******** ATMOSUD *************
//on va chercher les coordonnées de AtmoSud (Stations)
function loadStationAtmo() {
    $.ajax({
        method: "GET",
        url: "https://api.atmosud.org/observations/stations?polluant_id=39,24,68&format=json&download=false&token="+api_key_atmo,
    }).done(function (data) {
        console.log("Getting data from AtmoSud (Stations localisation"); //récupère lat et long de toutes les stations qui mesurent des PM
        console.log(data.stations);
        $.each(data.stations, function (key, value) {
            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([value['latitude'], value['longitude']])
                .addTo(map)

        })
    })
};

//on va chercher les coordonnées de AtmoSud (micro-capteurs Fixes)

function loadCapteurAtmo() {
    $.ajax({
        method: "GET",
        url: "https://api.atmosud.org/observations/capteurs/sites/live?format=json&download=false&delais=60&formatage=dict&token="+api_key_atmo,
    }).done(function (data) {
        console.log("Getting data from AtmoSud (capteurs"); //récupère lat et long de toutes les stations qui mesurent des PM
        console.log(data);
        $.each(data, function (key, value) {
             //custom icon setup
             var icon_param = {
                iconUrl: './img/capteursAtmo/logoCapteurAtmo_bon.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [0, 60], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //add icon to map
            var capteur_icon = L.icon(icon_param);

            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([value['lat'], value['lon']], { icon: capteur_icon })
                .addTo(map)

        })
    })
};


function loadModelisatonAtmo() {
    console.log("Getting data from AtmoSud (modelisation)"); 
    var coumpound_map = "pm10";

    //layer pollution
    L.tileLayer("https://geoservices.atmosud.org/geowebcache/service/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" + "&STYLE=normal" +
        "&TILEMATRIXSET=EPSG:900913" +
        "&FORMAT=image/png8" +
        "&LAYER=azurjour:paca-" + coumpound_map + "-"+current_date+"" +
        "&TILEMATRIX=EPSG:900913:{z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}", {
        minZoom: 0,
        maxZoom: 18,
        attribution: "AtmoSud",
        tileSize: 256,
        opacity: 0.5,
    }).addTo(map);
}