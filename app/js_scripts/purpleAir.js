// ****** PURPLE AIR ************
//on va chercher les coordonnées des Purple Air
function loadPurpleAir() {
    $.ajax({
        method: "GET",
        url: "./php_scripts/get_dataPurpleAir.php",
    }).done(function (data) {

        console.log("Getting data from Purple Air");
        console.log(data);
        $.each(data, function (key, value) {

            var last_seen = value[1];
            var lat = value[3];
            var long = value[4]
            var pm1_value = value[5];

            last_seen = timeConverter(last_seen);

            function timeConverter(UNIX_timestamp) {
                var a = new Date(UNIX_timestamp * 1000);
                var months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var sec = a.getSeconds();
                var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
                return time;
            }

            //on créer un popup pour chaque PurpleAir
            var purpleAirPopup = '<img src="img/purpleAir/purpleAirLogo.jpg" alt="" class="card-img-top">' +
                '<h3>PM1: ' + pm1_value + '<span>&#181;</span>g/m<span>&#179;</span></h3>' +
                '<h4>Dernière mesure ' + last_seen + '</h4>' +

                '<br>Capteur qualité de l\'air extérieur Purple Air <br>' +
                '<br><a href="https://map.purpleair.com/"><button class="btn btn-primary">Plus d\'information sur map.purpleair.com</button></a>'

            //inage for the sensors on the map
            var icon_param_purpleAir = {
                iconUrl: 'img/purpleAir/purpleAir_bon.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [0, 60], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //MOYEN
            if (pm1_value >= 10) {
                icon_param_purpleAir.iconUrl = 'img/purpleAir/purpleAir_moyen.png';
            }
            //DEGRADE
            if (pm1_value >= 20) {
                icon_param_purpleAir.iconUrl = 'img/purpleAir/purpleAir_degrade.png';
            }
            //MAUVAIS
            if (pm1_value >= 25) {
                icon_param_purpleAir.iconUrl = 'img/purpleAir/purpleAir_mauvais.png';
            }
            //TRES MAUVAIS
            if (pm1_value >= 50) {
                icon_param_purpleAir.iconUrl = 'img/purpleAir/purpleAir_tresMauvais.png';
            }
            //extr MAUVAIS
            if (pm1_value >= 75) {
                icon_param_purpleAir.iconUrl = 'img/purpleAir/purpleAir_extrMauvais.png';
            }


            //add icon to map
            var purpleAir_icon = L.icon(icon_param_purpleAir);

            //textSize
            var textSize = 45;
            var x_position = -18;
            var y_position = 54;

            //smaller text size if number is greater than 9
            if (pm1_value >= 10) {
                textSize = 38;
                x_position = -8;
                y_position = 49;
            }

            // cutom text on the marker
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + Math.round(pm1_value) + '</div>',
                iconAnchor: [x_position, y_position],
                popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });
            // you can set .my-div-icon styles in CSS


            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([lat, long], { icon: purpleAir_icon })
                .addTo(map)


            //on ajoute le texte sur les points
            L.marker([lat, long], { icon: myIcon })
                .addTo(map)
                .bindPopup(purpleAirPopup, {
                    maxWidth: 4000
                });
        })
    })
};