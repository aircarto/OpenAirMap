//on va chercher les coordonnées des NebuleAir 
function loadNebuleAir() {
    console.log("%cNebuleAir", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
    const start = Date.now();
    
    $.ajax({
        method: "GET",
        url: "../php_scripts/NebuleAir.php",
    }).done(function (data) {

        closeToast_loading();

        const end = Date.now();
        const requestTimer = (end - start)/1000;

        console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
        console.log(data);
        $.each(data, function (key, value) {

            var value_compound = Math.round(value[compoundUpper]);

            //on créer un popup qui s'ouvre pour chaque NebuleAir avec les "gauges"
            var nebuloPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
                '<div id="gauge-pm1-'+ value['sensorId'] +'" class="gauge-container myStyle"></div>'+
                '<div id="gauge-pm25-'+ value['sensorId'] +'" class="gauge-container"></div>'+
                '<div id="gauge-pm10-'+ value['sensorId'] +'" class="gauge-container"></div>'+

                '<br>Capteur qualité de l\'air extérieur (' + value['sensorId'] + ') <br>' +
                '<br><button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>'

                


            //image des points sur la carte
            var icon_param = {
                iconUrl: 'img/nebulo/nebulo_iconV2_bon.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //change icon color for PM1 and PM25

            //MOYEN
            if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_tresmauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_extmauvais.png';
            }


            //change icon color for PM1 and PM25

            //MOYEN
            if (value_compound >= 20 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 40 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 50 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 100 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_tresmauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 150 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/nebulo/nebulo_iconV2_extmauvais.png';
            }

            //add icon to map
            var nebulo_icon = L.icon(icon_param);

            //textSize (if number under 10)
            var textSize = 45;
            var x_position = -22;
            var y_position = 62;

            //smaller text size if number is greater than 9
            if (value_compound >= 10) {
                textSize = 38;
                x_position = -14;
                y_position = 56;
            }

              //smaller text size if number is greater than 99
              //TODO !!!
              if (value_compound >= 100) {
                textSize = 30;
                x_position = -14;
                y_position = 56;
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
                })
                .on('click', function(){
                    console.log("click event on " + value['sensorId'])
                    //Ce n'est qu'une fois que l'on a cliqué sur le marker que l'on peut créer la gauge
                    var id_gauge_pm1 = 'gauge-pm1-' + value['sensorId']
                    var id_gauge_pm25 = 'gauge-pm25-' + value['sensorId']
                    var id_gauge_pm10 = 'gauge-pm10-' + value['sensorId']

                    var myGauge_pm1 = Gauge(document.getElementById(id_gauge_pm1),{
                        dialRadius: 40,
                        dialStartAngle: 135,
                        dialEndAngle: 45,
                        value: 0,
                        max: 100,
                        min: 0,
                        showValue: true,
                        gaugeColor: null,
                        label: function(value) {
                            return Math.round(value) + " ug/m3";
                        },
                    });

                    var myGauge_pm25 = Gauge(document.getElementById(id_gauge_pm25),{
                        dialRadius: 40,
                        dialStartAngle: 135,
                        dialEndAngle: 45,
                        value: 0,
                        max: 100,
                        min: 0,
                        showValue: true,
                        gaugeColor: null,
                        label: function(value) {
                            return Math.round(value) + " ug/m3";
                        },
                    });

                    var myGauge_pm10 = Gauge(document.getElementById(id_gauge_pm10),{
                        dialRadius: 40,
                        dialStartAngle: 135,
                        dialEndAngle: 45,
                        value: 0,
                        max: 100,
                        min: 0,
                        showValue: true,
                        gaugeColor: null,
                        label: function(value) {
                            return Math.round(value) + " ug/m3";
                        },
                    });

                    myGauge_pm1.setValueAnimated(value['PM1'], 1);
                    myGauge_pm25.setValueAnimated(value['PM25'], 1);
                    myGauge_pm10.setValueAnimated(value['PM10'], 1);

                });
                

                

            //.openPopup();
        });

    })
    .fail(function(){
        console.log("Error while geting data from AirCarto API");
    });
};