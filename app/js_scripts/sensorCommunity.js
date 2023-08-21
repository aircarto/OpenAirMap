//on va chercher les coordonnées des NebuleAir 
function loadSensorCommunity() {
    console.log("%cSensor.Community", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
    const start = Date.now();
    
    $.ajax({
        method: "GET",
        url: "../php_scripts/SensorCommunity.php",
    }).done(function (data) {

        closeToast_loading();

        const end = Date.now();
        const requestTimer = (end - start)/1000;

        console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
        //console.log(data);

        let sensorsList=[];

        $.each(data, function (key, item) {

            //console.log(item["sensordatavalues"]);

        var value_compound;
        var filtered;
        // = Math.round(value[compoundUpper]);

        switch (compoundUpper) {
            case "PM1":
                filtered = item["sensordatavalues"].filter((e) => e.value_type == "PO");
                if (filtered.length > 0){
                    value_compound = Math.round(filtered[0]["value"]);
                    }
              break;
            case "PM25":
                filtered = item["sensordatavalues"].filter((e) => e.value_type == "P2");
                if (filtered.length > 0){
                value_compound = Math.round(filtered[0]["value"]);
                }
              break;
            case "PM10":
                filtered = item["sensordatavalues"].filter((e) => e.value_type == "P1");
                if (filtered.length > 0){
                    value_compound = Math.round(filtered[0]["value"]);
                    }
              break;
          }




          if (value_compound != undefined && !sensorsList.includes(item['sensor']['id'])){

            sensorsList.push(item['sensor']['id']);

            //image des points sur la carte
            var icon_param = {
                iconUrl: 'img/SensorCommunity/SensorCommunity_default.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //change icon color for PM1 and PM25
            if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_bon.png';
            }
            //MOYEN
            if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_tresMauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_extMauvais.png';
            }


            //change icon color for PM10
            if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_bon.png';
            }
            //MOYEN
            if (value_compound >= 20 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_moyen.png';
            }
            //DEGRADE
            if (value_compound >= 40 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_degrade.png';
            }
            //MAUVAIS
            if (value_compound >= 50 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_mauvais.png';
            }
            //TRES MAUVAIS
            if (value_compound >= 100 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_tresMauvais.png';
            }
            //extr MAUVAIS
            if (value_compound >= 150 && compoundUpper == "PM10") {
                icon_param.iconUrl = 'img/SensorCommunity/SensorCommunity_extMauvais.png';
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

            if (value_compound != undefined && value_compound != null )
            {
            // cutom text on the marker
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
                iconAnchor: [x_position, y_position],
                popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });
            // you can set .my-div-icon styles in CSS
        }else{
            // cutom text on the marker
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + '*' + '</div>',
                iconAnchor: [x_position, y_position],
                popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });
            // you can set .my-div-icon styles in CSS

        }

            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: nebulo_icon })
                .addTo(sensorCommunity)

            //on ajoute le texte sur les points
            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
                //.addTo(map)
                // .bindPopup(nebuloPopup, {
                //     maxWidth: 4000
                // })
                .on('click', function(){
                    
                })
                .addTo(sensorCommunity);
                

                

            //.openPopup();
            }
        
        });

    })
    .fail(function(){
        console.log("Error while geting data from AirCarto API");
    });
};