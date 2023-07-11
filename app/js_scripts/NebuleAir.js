//on va chercher les coordonnées des NebuleAir 
function loadNebuleAir() {
    console.log("Getting data for NebuleAir !!!:");
    const start = Date.now();
    
    $.ajax({
        method: "GET",
        url: "../php_scripts/NebuleAir.php",
    }).done(function (data) {

        closeToast_loading();
        const end = Date.now();

        console.log(`Data gathered in ${end - start} ms`);
        console.log(data);
        $.each(data, function (key, value) {

            var value_compound = Math.round(value[compoundUpper]);

            //on créer un popup pour chaque Nebulo
            var nebuloPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
                // '<h3>' + value['sensorId'] + '</h3>' +
                '<iframe src="https://grafana.moduleair.fr/d-solo/Hcs4NEb4z/nebuleair?orgId=1&var-device=' + value['sensorId'] + '&from=now-5m&to=now&theme=light&panelId=8" width="33%" frameborder="0"></iframe>' +
                '<iframe src="https://grafana.moduleair.fr/d-solo/Hcs4NEb4z/nebuleair?var-device=' + value['sensorId'] + '&from=now-5m&to=now&orgId=1&theme=light&panelId=6" width="33%"  frameborder="0"></iframe>' +
                '<iframe src="https://grafana.moduleair.fr/d-solo/Hcs4NEb4z/nebuleair?var-device=' + value['sensorId'] + '&from=now-5m&to=now&orgId=1&theme=light&panelId=4" width="33%"  frameborder="0"></iframe>' +

                '<br>Capteur qualité de l\'air extérieur (' + value['sensorId'] + ') <br>' +
                '<br><button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>'


            //custom icon setup
            var icon_param = {
                iconUrl: 'img/nebulo_iconV2_bon.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [0, 60], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //change icon color for PM1 and PM25

            //MOYEN
            if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo_iconV2_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo_iconV2_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo_iconV2_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo_iconV2_tresmauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo_iconV2_extmauvais.png';
            }


            //change icon color for PM1 and PM25

            //MOYEN
            if (value_compound >= 20 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo_iconV2_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 40 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo_iconV2_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 50 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo_iconV2_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 100 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo_iconV2_tresmauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 150 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo_iconV2_extmauvais.png';
            }

            //add icon to map
            var nebulo_icon = L.icon(icon_param);

            //textSize
            var textSize = 45;
            var x_position = -26;
            var y_position = 54;

            //smaller text size if number is greater than 9
            if (value_compound >= 10) {
                textSize = 38;
                x_position = -18;
                y_position = 47;
            }

            // cutom text on the marker
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
                iconAnchor: [x_position, y_position],
                popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });
            // you can set .my-div-icon styles in CSS


            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([value['latitude'], value['longitude']], { icon: nebulo_icon })
                .addTo(map)

            //on ajoute le texte sur les points
            L.marker([value['latitude'], value['longitude']], { icon: myIcon })
                .addTo(map)
                .bindPopup(nebuloPopup, {
                    maxWidth: 4000
                });



            //.openPopup();
        });

    });
};