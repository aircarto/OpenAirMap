function loadStationMicroAtmo() {
  console.log("%cAtmoSud Micro", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const start = Date.now();
  stationsMicroAtmoSud.clearLayers();

  $.ajax({
    method: "GET",
    url: "../php_scripts/AtmoSudMicro.php",
    data: ({ timespan: timespanLower }),
  }).done(function (data) {

    const end = Date.now();
    const requestTimer = (end - start) / 1000;
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

      var value_compound = Math.round(item["valeur_brute"]);

      var AtmoSudMicroPopup = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
        '<div id="gauges">' +
        '<div id="chartdiv1"></div>' +
        '<div id="chartdiv2"></div>' +
        '<div id="chartdiv3"></div>' +
        '</div>' +
        '<div class="text-center" style="padding-top:15px">' +
        '<br>Dernière mesure effectuée :' + timeDateCounter(item.time) + '<br>' +
        '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">microstationAtmoSud-' + item.id_site + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'microstationAtmoSud-' + item.id_site + '\')">Voir les données</button>' +
        '</div>';

      var AtmoSudMicroTootip = item.nom_site;

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


      if (value_compound != undefined && value_compound != null) {
        // cutom text on the marker
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });
        L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
          .addTo(stationsMicroAtmoSud)



        if (!isMobile) {
        //on ajoute le texte sur les points
        L.marker([item['lat'], item['lon']], { icon: myIcon })
          .bindTooltip(AtmoSudMicroTootip, { direction: 'center' })
          .bindPopup(AtmoSudMicroPopup, {
            maxWidth: 4000
          })
          .on('click', function () {

            var filtered2 = data.filter((e) => e.id_site == item.id_site);

            console.log(filtered2);

            if (root1 != undefined && root2 != undefined && root3 != undefined) {
              console.log("DISPOSE")
              root1.dispose();
              root2.dispose();
              root3.dispose();
            }

            setTimeout(function () {
              am5.ready(function () {

                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                root1 = am5.Root.new("chartdiv1");
                root2 = am5.Root.new("chartdiv2");
                root3 = am5.Root.new("chartdiv3");

                gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                gaugeCreatorAtmoSudMicro(root2, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                gaugeCreatorAtmoSudMicro(root3, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");

              })
            }, 1000) // end am5.ready()

          })
          .addTo(stationsMicroAtmoSud);
        } else {

          L.marker([item['lat'], item['lon']], { icon: myIcon })
          .on('click', function () {

            var filtered2 = data.filter((e) => e.id_site == item.id_site);

            modalCreator("atmosudmicro", item.id_site, timeDateCounter(item.time),-1, item.nom_site);

            if (root1 != undefined) {
              console.log("DISPOSE")
              root1.dispose();
            }

            sensorPanelModal.show();

            setTimeout(function () {
              am5.ready(function () {

                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                root1 = am5.Root.new("modal_chartdivmodalgauge");

                switch (compoundUpper) {
                  case "PM1":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                    break;
                  case "PM25":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                    break;
                  case "PM10":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");
                    break;
                }

              })
            }, 1000) // end am5.ready()

          })
          .addTo(stationsMicroAtmoSud);

        }

      } else {
        // cutom text on the marker
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });

        if (!isMobile) {
        L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
          .bindTooltip(AtmoSudMicroTootip, { direction: 'center' })
          .bindPopup(AtmoSudMicroPopup, {
            maxWidth: 4000
          })
          .on('click', function () {

            var filtered2 = data.filter((e) => e.id_site == item.id_site);

            console.log(filtered2);

            if (root1 != undefined && root2 != undefined && root3 != undefined) {
              console.log("DISPOSE")
              root1.dispose();
              root2.dispose();
              root3.dispose();
            }

            setTimeout(function () {
              am5.ready(function () {

                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                root1 = am5.Root.new("chartdiv1");
                root2 = am5.Root.new("chartdiv2");
                root3 = am5.Root.new("chartdiv3");


                gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                gaugeCreatorAtmoSudMicro(root2, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                gaugeCreatorAtmoSudMicro(root3, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");


              })
            }, 1000) // end am5.ready()

          })
          .addTo(stationsMicroAtmoSud).setZIndexOffset(-1000);
        } else {
          L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
          .on('click', function () {
            var filtered2 = data.filter((e) => e.id_site == item.id_site);

            modalCreator("atmosudmicro", item.id_site, timeDateCounter(item.time),-1, item.nom_site);
            if (root1 != undefined) {
              console.log("DISPOSE")
              root1.dispose();
            }

            sensorPanelModal.show();

            setTimeout(function () {
              am5.ready(function () {

                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                root1 = am5.Root.new("modal_chartdivmodalgauge");

                switch (compoundUpper) {
                  case "PM1":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                    break;
                  case "PM25":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                    break;
                  case "PM10":
                    gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");
                    break;
                }

              })
            }, 1000) // end am5.ready()

              
          })
        .addTo(stationsMicroAtmoSud).setZIndexOffset(-1000);
        }
      }
    })
  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    })
};

function changeStationMicroAtmo() {

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

  var filtered = apiFetchAtmoSudMicro.data.filter((e) => e.variable == compoundFunction);

  $.each(filtered, function (key, item) {

    var value_compound = Math.round(item["valeur_brute"]);

    var AtmoSudMicroPopup = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
      '<div id="gauges">' +
      '<div id="chartdiv1"></div>' +
      '<div id="chartdiv2"></div>' +
      '<div id="chartdiv3"></div>' +
      '</div>' +
      '<div class="text-center" style="padding-top:15px">' +
      '<br>Dernière mesure effectuée :' + timeDateCounter(item.time) + '<br>' +
      '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">microstationAtmoSud-' + item.id_site + '</button>' +
      '<button class="btn btn-primary" onclick="OpenSidePanel(\'microstationAtmoSud-' + item.id_site + '\')">Voir les données</button>' +
      '</div>';

    var AtmoSudMicroTootip = item.nom_site;

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


    if (value_compound != undefined && value_compound != null) {
      // cutom text on the marker
      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

      });

      L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
        .addTo(stationsMicroAtmoSud);

        if (!isMobile) {
      //on ajoute le texte sur les points
      L.marker([item['lat'], item['lon']], { icon: myIcon })
        .bindTooltip(AtmoSudMicroTootip, { direction: 'center' })
        .bindPopup(AtmoSudMicroPopup, {
          maxWidth: 4000
        })
        .on('click', function () {

          var filtered2 = apiFetchAtmoSudMicro.data.filter((e) => e.id_site == item.id_site);

          console.log(filtered2);

          if (root1 != undefined && root2 != undefined && root3 != undefined) {
            console.log("DISPOSE")
            root1.dispose();
            root2.dispose();
            root3.dispose();
          }

          setTimeout(function () {
            am5.ready(function () {

              // Create root element
              // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              root1 = am5.Root.new("chartdiv1");
              root2 = am5.Root.new("chartdiv2");
              root3 = am5.Root.new("chartdiv3");

              gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
              gaugeCreatorAtmoSudMicro(root2, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
              gaugeCreatorAtmoSudMicro(root3, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");

            })
          }, 1000) // end am5.ready()

        })
        .addTo(stationsMicroAtmoSud);
      }else
      {
        L.marker([item['lat'], item['lon']], { icon: myIcon })
        .on('click', function () {

          var filtered2 = data.filter((e) => e.id_site == item.id_site);


          modalCreator("atmosudmicro", item.id_site, timeDateCounter(item.time),-1, item.nom_site);
          if (root1 != undefined) {
            console.log("DISPOSE")
            root1.dispose();
          }

          sensorPanelModal.show();

          setTimeout(function () {
            am5.ready(function () {

              // Create root element
              // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              root1 = am5.Root.new("modal_chartdivmodalgauge");
              switch (compoundUpper) {
                case "PM1":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                  break;
                case "PM25":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                  break;
                case "PM10":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");
                  break;
              }

            })
          }, 1000) // end am5.ready()

        })
        .addTo(stationsMicroAtmoSud);
      }
    } else {
      // cutom text on the marker
      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

      });

      if (!isMobile) {
      L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
        .bindTooltip(AtmoSudMicroTootip, { direction: 'center' })
        .bindPopup(AtmoSudMicroPopup, {
          maxWidth: 4000
        })
        .on('click', function () {

          var filtered2 = apiFetchAtmoSudMicro.data.filter((e) => e.id_site == item.id_site);

          console.log(filtered2);

          if (root1 != undefined && root2 != undefined && root3 != undefined) {
            console.log("DISPOSE")
            root1.dispose();
            root2.dispose();
            root3.dispose();
          }

          setTimeout(function () {
            am5.ready(function () {

              // Create root element
              // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              root1 = am5.Root.new("chartdiv1");
              root2 = am5.Root.new("chartdiv2");
              root3 = am5.Root.new("chartdiv3");


              gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
              gaugeCreatorAtmoSudMicro(root2, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
              gaugeCreatorAtmoSudMicro(root3, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");

            })
          }, 1000) // end am5.ready()

        })
        .addTo(stationsMicroAtmoSud).setZIndexOffset(-1000);
      }else{
        L.marker([item['lat'], item['lon']], { icon: microStationsAtmoSud_icon })
        .on('click', function () {

          var filtered2 = data.filter((e) => e.id_site == item.id_site);

          modalCreator("atmosudmicro", item.id_site, timeDateCounter(item.time),-1, item.nom_site);


          if (root1 != undefined) {
            console.log("DISPOSE")
            root1.dispose();
          }

          sensorPanelModal.show();

          setTimeout(function () {
            am5.ready(function () {

              // Create root element
              // https://www.amcharts.com/docs/v5/getting-started/#Root_element
              root1 = am5.Root.new("modal_chartdivmodalgauge");

              switch (compoundUpper) {
                case "PM1":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM1")[0].valeur_brute, "PM1");
                  break;
                case "PM25":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM2.5")[0].valeur_brute, "PM25");
                  break;
                case "PM10":
                  gaugeCreatorAtmoSudMicro(root1, filtered2.filter((e) => e.variable == "PM10")[0].valeur_brute, "PM10");
                  break;
              }

            })
          }, 1000) // end am5.ready()

        })
      .addTo(stationsMicroAtmoSud).setZIndexOffset(-1000);
      }
    }
  })
}

function load1MicroAtmo(id, hours) {

  console.log("%cAtmoSud Micro 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(start_string);
  console.log(end_string);

  console.log(id);

  //ATTENTION, ON EST EN UTC

  let chartTitleText = "";
  chartTitleText += "AtmoSudMicro-" + id + ", mesures à 15 min.,  µg/m3";

  $.ajax({
    method: "GET",
    url: "../php_scripts/AtmoSudMicro_1sensor.php",
    data: ({
      id_site: id,
      debut: start_string,
      fin: end_string
    }),
  }).done(function (data) {
    console.log(data);

    if (root4 != undefined) {
      console.log("DISPOSE")
      root4.dispose();
    }

    setTimeout(function () {
      am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
        root4 = am5.Root.new("chartSensor2");
        graphCreatorAtmoSudMicro(root4, data, chartTitleText);
      })
    }, 1000); // end am5.ready()

  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    });
}

function switchMicroAtmo() {
  if (
    (timespanLower != 2) &
    (timespanLower != 60) &
    (timespanLower != 1440)
  ) {
    if (
      document.querySelector("#checkbox_micro_stationsAtmoSud").checked
    ) {
      if (
        apiFetchAtmoSudMicro.data.length == 0 ||
        (apiFetchAtmoSudMicro.data.length != 0 &&
          apiFetchAtmoSudMicro.timespan != timespanLower)
      ) {
        console.log("Reload AtmoSud Micro!");
        loadStationMicroAtmo();
      } else {
        if (
          apiFetchAtmoSudMicro.data.length == 0 ||
          (apiFetchAtmoSudMicro.data.length != 0 &&
            Date.now() - apiFetchAtmoSudMicro.timestamp >
              timespanLower * 60 * 1000)
        ) {
          console.log("Reload AtmoSud Micro");
          loadStationMicroAtmo();
        }
      }
      map.addLayer(stationsMicroAtmoSud);
    } else {
      map.removeLayer(stationsMicroAtmoSud);
    }
  } else {
    openToast(
      "Pas de données à intervalles 2 minutes, 1 heure ou 1 jour pour les microstations AtmoSud"
    );
    document.querySelector(
      "#checkbox_micro_stationsAtmoSud"
    ).checked = false;
  }
  setQueryString();
}

function chooseTimeAtmoMicro(sensor, hours, modal) {
  console.log(sensor);
  console.log(hours);
  if(!modal){
  load1MicroAtmo(sensor, hours);
  buttonsSwitcher(hours, 15, false); //REVOIR
  }else{
    load1MicroAtmoModal(sensor, hours);
    buttonsSwitcher(hours, 15, true); //REVOIR
  }
}

function gaugeCreatorAtmoSudMicro(root, measure, type) {

  console.log(root);
  console.log(measure);
  console.log(type);


                // Set themes
                // https://www.amcharts.com/docs/v5/concepts/themes/
                root.setThemes([
                  am5themes_Animated.new(root)
                ]);


                // Create chart
                // https://www.amcharts.com/docs/v5/charts/radar-chart/
                let chart = root.container.children.push(am5radar.RadarChart.new(root, {
                  panX: false,
                  panY: false,
                  startAngle: 160,
                  endAngle: 380
                }));


                // Create axis and its renderer
                // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                let axisRenderer = am5radar.AxisRendererCircular.new(root, {
                  innerRadius: -20,
                  minGridDistance: 20
                });

                axisRenderer.grid.template.setAll({
                  stroke: root.interfaceColors.get("background"),
                  visible: false,
                  strokeOpacity: 0.8
                });


                let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
                  maxDeviation: 0,
                  min: 0,
                  max: 100,
                  strictMinMax: true,
                  renderer: axisRenderer
                }));


                // Add clock hand
                // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                let axisDataItem = xAxis.makeDataItem({});

                let clockHand = am5radar.ClockHand.new(root, {
                  pinRadius: am5.percent(20),
                  radius: am5.percent(35),
                  bottomWidth: 20
                })

                let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
                  sprite: clockHand
                }));

                xAxis.createAxisRange(axisDataItem);

                let label = chart.radarContainer.children.push(am5.Label.new(root, {
                  fill: am5.color(0xffffff),
                  centerX: am5.percent(50),
                  textAlign: "center",
                  centerY: am5.percent(50),
                  fontSize: "1em"
                }));

                axisDataItem.set("value", 0);
                bullet.get("sprite").on("rotation", function () {
                  let value = axisDataItem.get("value");
                  let text = Math.round(axisDataItem.get("value")).toString();
                  let fill = am5.color(0x000000);
                  xAxis.axisRanges.each(function (axisRange) {
                    if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
                      fill = axisRange.get("axisFill").get("fill");
                    }
                  })

                  if(measure !=null){
                  label.set("text", Math.round(value).toString());
                  }else{
                    label.set("text", "N/A");
                  }

                  clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if(measure !=null){
                setTimeout(function () {
                  axisDataItem.animate({
                    key: "value",
                    to: measure,
                    duration: 500,
                    easing: am5.ease.out(am5.ease.cubic)
                  });
                }, 1000)
              }else{
                root.dom.style.opacity = 0.2;
                root.dom.style.filter = "alpha(opacity = 20)";
              }

                chart.bulletsContainer.set("mask", undefined);


                let bandsData;
                let title;
              
                if (type == "PM25" || type == "PM1") {
                  bandsData = [
                    {
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10,
                    },
                    {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 10,
                      highScore: 20,
                    },
                    {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 20,
                      highScore: 25,
                    },
                    {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 25,
                      highScore: 50,
                    },
                    {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 50,
                      highScore: 75,
                    },
                    {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 75,
                      highScore: 100,
                    },
                  ];
                }
              
                if (type == "PM10") {
                  bandsData = [
                    {
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 20,
                    },
                    {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 20,
                      highScore: 40,
                    },
                    {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 40,
                      highScore: 50,
                    },
                    {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 50,
                      highScore: 100,
                    },
                    {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 100,
                      highScore: 150,
                    },
                    {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 150,
                      highScore: 200,
                    },
                  ];
                }
                switch (type) {
                  case "PM1":
                    title = "PM1";
                    break;
                  case "PM25":
                    title = "PM2.5";
                    break;
                  case "PM10":
                    title = "PM10";
                    break;
                }
              
                am5.array.each(bandsData, function (data) {
                  var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

                  axisRange.setAll({
                    value: data.lowScore,
                    endValue: data.highScore
                  });

                  axisRange.get("axisFill").setAll({
                    visible: true,
                    fill: am5.color(data.color),
                    fillOpacity: 1
                  });

                  // axisRange1.get("grid").setAll({
                  //   stroke: am5.color(data.color),
                  //   strokeOpacity: 1
                  // });



                  // axisRange1.get("label").setAll({
                  //   text: data.title,
                  //   inside: true,
                  //   radius: 15,
                  //   fontSize: "0.9em",
                  //   fill: root1.interfaceColors.get("background")
                  // });
                });

                chart.children.unshift(am5.Label.new(root, {
                  text: "µg/m³",
                  fontSize: 10,
                  textAlign: "center",
                  x: am5.percent(50),
                  centerX: am5.percent(50),
                  paddingTop: 15,
                }));

                chart.children.unshift(am5.Label.new(root, {
                  text: title,
                  fontSize: 15,
                  fontWeight: "500",
                  textAlign: "center",
                  x: am5.percent(50),
                  centerX: am5.percent(50),
                  paddingTop: 0,
                  paddingBottom: 0
                }));


                // Make stuff animate on load
                chart.appear(1000, 100);
                xAxis.get("renderer").grid.template.set("forceHidden", true);


}

function graphCreatorAtmoSudMicro(root, data, text) {

  let filter_PM1 = data.filter((e) => e.variable == "PM1");
  let filter_PM25 = data.filter((e) => e.variable == "PM2.5");
  let filter_PM10 = data.filter((e) => e.variable == "PM10");


  let data_PM1 = filter_PM1.map(function (e) {
    return { value: e.valeur_brute, date: new Date(e.time).getTime() }
  });
  let data_PM25 = filter_PM25.map(function (e) {
    return { value: e.valeur_brute, date: new Date(e.time).getTime() }
  });
  let data_PM10 = filter_PM10.map(function (e) {
    return { value: e.valeur_brute, date: new Date(e.time).getTime() }
  });


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/ 
        root.setThemes([
          am5themes_Animated.new(root)
        ]);


        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          maxTooltipDistance: 0,
          pinchZoomX: true
        }));

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
          maxDeviation: 0.2,
          baseInterval: {
            timeUnit: "minute",
            count: 1
          },
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        }));

        let series_PM1 = chart.series.push(am5xy.LineSeries.new(root, {
          name: "PM1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          })
        }));

        series_PM1.data.setAll(data_PM1);
        series_PM1.appear();

        let series_PM25 = chart.series.push(am5xy.LineSeries.new(root, {
          name: "PM2.5",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          })
        }));

        series_PM25.data.setAll(data_PM25);
        series_PM25.appear();


        let series_PM10 = chart.series.push(am5xy.LineSeries.new(root, {
          name: "PM10",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          })
        }));

        series_PM10.data.setAll(data_PM10);
        series_PM10.appear();

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "zoomX",
          xAxis: xAxis,
          snapToSeries: [series_PM1, series_PM25, series_PM10],
          // snapToSeriesBy: "x"
        }));
        cursor.lineX.set("visible", true);
        cursor.lineY.set("visible", false);


        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        // chart4.set("scrollbarX", am5.Scrollbar.new(root4, {
        //     orientation: "horizontal"
        // }));

        // chart4.set("scrollbarY", am5.Scrollbar.new(root4, {
        //     orientation: "vertical"
        // }));


        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        let legend = chart.bottomAxesContainer.children.push(am5.Legend.new(root, {
          width: 400,
          height: am5.percent(20),
          layout: root.horizontalLayout,
        }));

        // When legend item container is hovered, dim all the series except the hovered one
        legend.itemContainers.template.events.on("pointerover", function (e) {
          let itemContainer = e.target;

          // As series list is data of a legend, dataContext is series
          let series = itemContainer.dataItem.dataContext;

          chart.series.each(function (chartSeries) {
            if (chartSeries != series) {
              chartSeries.strokes.template.setAll({
                strokeOpacity: 0.15,
                stroke: am5.color(0x000000)
              });
            } else {
              chartSeries.strokes.template.setAll({
                strokeWidth: 3
              });
            }
          })
        })

        // When legend item container is unhovered, make all series as they are
        legend.itemContainers.template.events.on("pointerout", function (e) {
          let itemContainer = e.target;
          let series = itemContainer.dataItem.dataContext;

          chart.series.each(function (chartSeries) {
            chartSeries.strokes.template.setAll({
              strokeOpacity: 1,
              strokeWidth: 1,
              stroke: chartSeries.get("fill")
            });
          });
        })

        legend.itemContainers.template.set("width", am5.p100);
        legend.valueLabels.template.setAll({
          width: am5.p100,
          textAlign: "right"
        });

        // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
        legend.data.setAll(chart.series.values);

        chart.children.unshift(am5.Label.new(root, {
          text: text,
          fontSize: 14,
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50)
        }));

        var exporting = am5plugins_exporting.Exporting.new(root, {
          menu: am5plugins_exporting.ExportingMenu.new(root, {}),
          dataSource: data
        });

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
}


function load1MicroAtmoModal(id, hours) {

  console.log("%cAtmoSud Micro 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(start_string);
  console.log(end_string);

  console.log(id);

  //ATTENTION, ON EST EN UTC

  let chartTitleText = "";
  chartTitleText += "AtmoSudMicro-" + id + ", mesures à 15 min.,  µg/m3";

  $.ajax({
    method: "GET",
    url: "../php_scripts/AtmoSudMicro_1sensor.php",
    data: ({
      id_site: id,
      debut: start_string,
      fin: end_string
    }),
  }).done(function (data) {
    console.log(data);

    if (root4 != undefined) {
      console.log("DISPOSE")
      root4.dispose();
    }

    setTimeout(function () {
      am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
        root4 = am5.Root.new("modal_chartSensor2");
        graphCreatorAtmoSudMicro(root4, data, chartTitleText);
      })
    }, 1000); // end am5.ready()

  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    });

}