
// var date = new Date();
// var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();

//on va chercher les coordonnées des Stations de Référence (fixe)
function loadStationMicroAtmo() {
    console.log("%cAtmoSud Micro", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);

    $.ajax({
        method: "GET",
        url: "../php_scripts/AtmoSudMicro.php",
        data: ({timespan: timespanLower}),
    }).done(function (data) {
        closeToast_loading();

        const end = Date.now();
        const requestTimer = (end - start)/1000;
        console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
        console.log(data);

        apiFetchAtmoSudMicro.data = data;
        apiFetchAtmoSudMicro.timestamp = end;
        apiFetchAtmoSudMicro.timespan = timespanLower;
        
        var compoundFunction;
                switch (compoundUpper) {
            case "PM1":
                compoundFunction = "PM1";
              break;
            case "PM25":
                compoundFunction = "PM2.5";
              break;
            case "PM10":
                compoundFunction = "PM10";
              break;
          }

        var filtered = data.filter((e) => e.variable == compoundFunction);

        $.each(filtered, function (key, item) {

        var value_compound = Math.round(item["valeur"]);


        // switch (compoundUpper) {
        //     case "PM1":
        //         if (item.variable == "PM1"){
        //             }
        //       break;
        //     case "PM25":
        //         if (item.variable == "PM2.5"){
        //             var value_compound = Math.round(item["valeur"]);
        //             }
        //       break;
        //     case "PM10":
        //         if (item.variable == "PM10"){
        //             var value_compound = Math.round(item["valeur"]);
        //             }
        //       break;
        //       default:
        //         value_compound = undefined;
        //       break;
        //   }

          console.log(value_compound);

        //   if((item.variable == "PM10" || item.variable == "PM2.5"|| item.variable == "PM1") && item["valeur"] != null  && value_compound != undefined)  // will give undefined in Math.round
        //   {

          var icon_param = {
            iconUrl: 'img/microStationsAtmoSud/microStationAtmoSud_default.png',
            iconSize: [80, 80], // size of the icon
            iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
            //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
        }

        //change icon color for PM1 and PM25

        //BON
        if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_bon.png';
        }
        //MOYEN
        if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_moyen.png';
        }
        //DEGRADE
        if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_degrade.png';
        }
        //MAUVAIS
        if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_mauvais.png';
        }
        //TRES MAUVAIS
        if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_tresmauvais.png';
        }
        //extr MAUVAIS
        if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_extmauvais.png';
        }


        //change icon color for PM1 and PM25
        //BON
        if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_bon.png';
        }
        //MOYEN
        if (value_compound >= 20 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_moyen.png';
        }
        //DEGRADE
        if (value_compound >= 40 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_degrade.png';
        }
        //MAUVAIS
        if (value_compound >= 50 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_mauvais.png';
        }
        //TRES MAUVAIS
        if (value_compound >= 100 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_tresmauvais.png';
        }
        //extr MAUVAIS
        if (value_compound >= 150 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/microStationsAtmoSud/microStationAtmoSud_extmauvais.png';
        }

        //add icon to map
        var microStationsAtmoSud_icon = L.icon(icon_param);

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
        L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
            // .addTo(map)
            .addTo(stationsMicroAtmoSud)

        //on ajoute le texte sur les points
        L.marker([item['lat'], item['lon']], { icon: myIcon })
            // .addTo(map)
            // .bindPopup(nebuleAirPopup, {
            //     maxWidth: 4000
            // })
            .on('click', function(){

            })
            .addTo(stationsMicroAtmoSud);
        // }
        })
    })
    .fail(function(){
        console.log("Error while geting data from AtmoSud API");
    })
};

