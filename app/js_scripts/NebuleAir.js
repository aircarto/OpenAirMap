function loadNebuleAir() {
  console.log("%cNebuleAir", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const start = Date.now();
  nebuleairParticuliers.clearLayers();

  $.ajax({
    method: "GET",
    url: "../php_scripts/NebuleAir.php",
    // data: ({timespan: timespanLower}),
  }).done(function (data) {

    const end = Date.now();
    const requestTimer = (end - start) / 1000;

    console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
    console.log(data);

    var displayed = data.filter((e) => e.displayMap == true);

    console.log(displayed);

    apiFetchNebuleAir.data = displayed;
    apiFetchNebuleAir.timestamp = end;
    apiFetchNebuleAir.timespan = timespanLower;

    $.each(displayed, function (key, value) {

      var value_compound;
      var selector;

      switch (timespanLower) {
        case 2:
          if (value[compoundUpper] != null) {
            value_compound = Math.round(value[compoundUpper]);
          } else {
            value_compound = null;
          }
          selector = "";
          break;
        case 15:
          if (value[compoundUpper + "_qh"] != null) {
            value_compound = Math.round(value[compoundUpper + "_qh"]);
          } else {
            value_compound = null;
          }
          selector = "_qh";
          break;
        case 60:
          if (value[compoundUpper + "_h"] != null) {
            value_compound = Math.round(value[compoundUpper + "_h"]);
          } else {
            value_compound = null;
          }
          selector = "_h";
          break;
        case 1440:
          if (value[compoundUpper + "_d"] != null) {
            value_compound = Math.round(value[compoundUpper + "_d"]);
          } else {
            value_compound = null;
          }
          selector = "_d";
          break;
      }

      var wifiLevel = 2 * (parseInt(value['wifi_signal']) + 100);
      if (wifiLevel > 100) { wifiLevel = 100 }

      if (value.connected) {
        var nebuleAirPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
          '<div id="gauges">' +
          '<div id="chartdiv1"></div>' +
          '<div id="chartdiv2"></div>' +
          '<div id="chartdiv3"></div>' +
          '</div>' +
          '<div class="text-center" style="padding-top:15px">' +
          '<br>Dernière mesure effectuée :' + timeDateCounter2(value.timeUTC, value.time) + '<br>' +
          '<br>Qualité connexion WIFI ' + wifiLevel + ' %<br>' +
          '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">' + value['sensorId'] + '</button>' +
          '<button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>' +
          '<a class="btn btn-outline-primary"  style="margin-left:5px;" href="https://nebuleair.fr/monNebuleAir/index.html" role="button">Mon NebuleAir</a>' +
          '</div>';

      } else {
        var nebuleAirPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
          '<div id="gauges">' +
          '<div id="chartdiv1"></div>' +
          '<div id="chartdiv2"></div>' +
          '<div id="chartdiv3"></div>' +
          '</div>' +
          '<div class="text-center" style="padding-top:15px">' +
          '<br>Dernière mesure effectuée :' + timeDateCounter2(value.timeUTC, value.time) + '<br>' +
          '<br>Capteur déconnecté<br>' +
          '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">' + value['sensorId'] + '</button>' +
          '<button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>' +
          '<a class="btn btn-outline-primary" style="margin-left:5px;" href="https://nebuleair.fr/monNebuleAir/index.html" role="button">Mon NebuleAir</a>' +
          '</div>';

        var wifiLevel = -1;
      }

      var nebuleAirTootip = value['sensorId'];

      //image des points sur la carte
      var icon_param = {
        iconUrl: 'img/nebuleAir/nebuleAir_default.png',
        iconSize: [80, 80], // size of the icon
        iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
      }

      //change icon color for PM1 and PM25
      if (value.connected && value_compound != null) {
        //BON
        if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_bon.png';
        }
        //MOYEN
        if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_moyen.png';
        }
        //DEGRADE
        if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_degrade.png';
        }
        //MAUVAIS
        if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_mauvais.png';
        }
        //TRES MAUVAIS
        if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_tresmauvais.png';
        }
        //extr MAUVAIS
        if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_extmauvais.png';
        }


        //change icon color for PM10
        //BON
        if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_bon.png';
        }
        //MOYEN
        if (value_compound >= 20 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_moyen.png';
        }
        //DEGRADE
        if (value_compound >= 40 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_degrade.png';
        }
        //MAUVAIS
        if (value_compound >= 50 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_mauvais.png';
        }
        //TRES MAUVAIS
        if (value_compound >= 100 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_tresmauvais.png';
        }
        //extr MAUVAIS
        if (value_compound >= 150 && compoundUpper == "PM10") {
          icon_param.iconUrl = 'img/nebuleAir/nebuleAir_extmauvais.png';
        }
      }

      //add icon to map
      var nebuleAir_icon = L.icon(icon_param);

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
      if (value.connected && value_compound != null) {
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });

        L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
          .addTo(nebuleairParticuliers);

        if (!isMobile) {
          L.marker([value['latitude'], value['longitude']], { icon: myIcon })
            .bindTooltip(nebuleAirTootip, { direction: 'center' })
            .bindPopup(nebuleAirPopup, {
              maxWidth: 4000
              // autoclose:false,
              // closeButton:false
            })
            .on('click', function () {


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

                  gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                  gaugeCreatorNebuleAir(root2, value["PM25" + selector], "PM25",value.connected);
                  gaugeCreatorNebuleAir(root3, value["PM10" + selector], "PM10",value.connected);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(nebuleairParticuliers);
        } else {
          L.marker([value['latitude'], value['longitude']], { icon: myIcon })
            .on('click', function () {

              modalCreator("nebuleair", value['sensorId'], timeDateCounter2(value.timeUTC, value.time), wifiLevel);

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
                      gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                      break;
                    case "PM25":
                      gaugeCreatorNebuleAir(root1, value["PM25" + selector], "PM25",value.connected);
                      break;
                    case "PM10":
                      gaugeCreatorNebuleAir(root1, value["PM10" + selector], "PM10",value.connected);
                      break;
                  }

                })
              }, 1000) // end am5.ready()

            })
            .addTo(nebuleairParticuliers);
        }

      } else {

        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });

        if (!isMobile) {
          L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
            .bindTooltip(nebuleAirTootip, { direction: 'center' })
            .bindPopup(nebuleAirPopup, {
              maxWidth: 4000
              // autoclose:false,
              // closeButton:false
            })
            .on('click', function () {


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

                  gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                  gaugeCreatorNebuleAir(root2, value["PM25" + selector], "PM25",value.connected);
                  gaugeCreatorNebuleAir(root3, value["PM10" + selector], "PM10",value.connected);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(nebuleairParticuliers).setZIndexOffset(-1000);
        } else {
          // L.marker([value['latitude'], value['longitude']], { icon: myIcon })
          L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
            .on('click', function () {

              modalCreator("nebuleair", value['sensorId'], timeDateCounter2(value.timeUTC, value.time), wifiLevel);

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
                      gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                      break;
                    case "PM25":
                      gaugeCreatorNebuleAir(root1, value["PM25" + selector], "PM25",value.connected);
                      break;
                    case "PM10":
                      gaugeCreatorNebuleAir(root1, value["PM10" + selector], "PM10",value.connected);
                      break;
                  }

                })
              }, 1000) // end am5.ready()

            })
            .addTo(nebuleairParticuliers).setZIndexOffset(-1000);
        }
      }
    });

  })
    .fail(function () {
      console.log("Error while geting data from AirCarto API");
    });
}

function changeNebuleAir() {
  $.each(apiFetchNebuleAir.data, function (key, value) {

    var value_compound;
    var selector;

    switch (timespanLower) {
      case 2:
        if (value[compoundUpper] != null) {
          value_compound = Math.round(value[compoundUpper]);
        } else {
          value_compound = null;
        }
        selector = "";
        break;
      case 15:
        if (value[compoundUpper + "_qh"] != null) {
          value_compound = Math.round(value[compoundUpper + "_qh"]);
        } else {
          value_compound = null;
        }
        selector = "_qh";
        break;
      case 60:
        if (value[compoundUpper + "_h"] != null) {
          value_compound = Math.round(value[compoundUpper + "_h"]);
        } else {
          value_compound = null;
        }
        selector = "_h";
        break;
      case 1440:
        if (value[compoundUpper + "_d"] != null) {
          value_compound = Math.round(value[compoundUpper + "_d"]);
        } else {
          value_compound = null;
        }
        selector = "_d";
        break;
    }

    var wifiLevel = 2 * (parseInt(value['wifi_signal']) + 100);
    if (wifiLevel > 100) { wifiLevel = 100 }

    if (value.connected) {
      var nebuleAirPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
        '<div id="gauges">' +
        '<div id="chartdiv1"></div>' +
        '<div id="chartdiv2"></div>' +
        '<div id="chartdiv3"></div>' +
        '</div>' +
        '<div class="text-center" style="padding-top:15px">' +
        '<br>Dernière mesure effectuée :' + timeDateCounter2(value.timeUTC, value.time) + '<br>' +
        '<br>Qualité connexion WIFI ' + wifiLevel + ' %<br>' +
        '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">' + value['sensorId'] + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>' +
        '<a class="btn btn-outline-primary" style="margin-left:5px;" href="https://nebuleair.fr/monNebuleAir/index.html" role="button">Mon NebuleAir</a>' +
        '</div>';

    } else {
      var nebuleAirPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
        '<div id="gauges">' +
        '<div id="chartdiv1"></div>' +
        '<div id="chartdiv2"></div>' +
        '<div id="chartdiv3"></div>' +
        '</div>' +
        '<div class="text-center" style="padding-top:15px">' +
        '<br>Dernière mesure effectuée :' + timeDateCounter2(value.timeUTC, value.time) + '<br>' +
        '<br>Capteur déconnecté<br>' +
        '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">' + value['sensorId'] + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>' +
        '<a class="btn btn-outline-primary" style="margin-left:5px;" href="https://nebuleair.fr/monNebuleAir/index.html" role="button">Mon NebuleAir</a>' +
        '</div>';

    }

    var nebuleAirTootip = value['sensorId'];

    //image des points sur la carte
    var icon_param = {
      iconUrl: 'img/nebuleAir/nebuleAir_default.png',
      iconSize: [80, 80], // size of the icon
      iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
    }

    //change icon color for PM1 and PM25

    if (value.connected && value_compound != null) {
      //BON
      if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_bon.png';
      }
      //MOYEN
      if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_tresmauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_extmauvais.png';
      }


      //change icon color for PM10
      //BON
      if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_bon.png';
      }
      //MOYEN
      if (value_compound >= 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 40 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 50 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 100 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_tresmauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 150 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/nebuleAir/nebuleAir_extmauvais.png';
      }
    }
    //add icon to map
    var nebuleAir_icon = L.icon(icon_param);

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
    if (value.connected && value_compound != null) {
      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

      });
      L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
        .addTo(nebuleairParticuliers);

      if (!isMobile) {

        L.marker([value['latitude'], value['longitude']], { icon: myIcon })
          .bindTooltip(nebuleAirTootip, { direction: 'center' })
          .bindPopup(nebuleAirPopup, {
            maxWidth: 4000
            // autoclose:false,
            // closeButton:false
          })
          .on('click', function () {


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

                gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                gaugeCreatorNebuleAir(root2, value["PM25" + selector], "PM25",value.connected);
                gaugeCreatorNebuleAir(root3, value["PM10" + selector], "PM10",value.connected);

              })
            }, 1000) // end am5.ready()

          })
          .addTo(nebuleairParticuliers);
      } else {
        L.marker([value['latitude'], value['longitude']], { icon: myIcon })
          .on('click', function () {

            modalCreator("nebuleair", value['sensorId'], timeDateCounter2(value.timeUTC, value.time), wifiLevel);

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
                    gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                    break;
                  case "PM25":
                    gaugeCreatorNebuleAir(root1, value["PM25" + selector], "PM25",value.connected);
                    break;
                  case "PM10":
                    gaugeCreatorNebuleAir(root1, value["PM10" + selector], "PM10",value.connected);
                    break;
                }


              })
            }, 1000) // end am5.ready()


          })
          .addTo(nebuleairParticuliers);



      }

    } else {

      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
      });

      if (!isMobile) {
        L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
          .bindTooltip(nebuleAirTootip, { direction: 'center' })
          .bindPopup(nebuleAirPopup, {
            maxWidth: 4000
            // autoclose:false,
            // closeButton:false
          })
          .on('click', function () {


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

                gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                gaugeCreatorNebuleAir(root2, value["PM25" + selector], "PM25",value.connected);
                gaugeCreatorNebuleAir(root3, value["PM10" + selector], "PM10",value.connected);


              })
            }, 1000) // end am5.ready()

          })
          .addTo(nebuleairParticuliers).setZIndexOffset(-1000);
      } else {
        // L.marker([value['latitude'], value['longitude']], { icon: myIcon })
        L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
          .on('click', function () {

            modalCreator("nebuleair", value['sensorId'], timeDateCounter2(value.timeUTC, value.time), wifiLevel);

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
                    gaugeCreatorNebuleAir(root1, value["PM1" + selector], "PM1",value.connected);
                    break;
                  case "PM25":
                    gaugeCreatorNebuleAir(root1, value["PM25" + selector], "PM25",value.connected);
                    break;
                  case "PM10":
                    gaugeCreatorNebuleAir(root1, value["PM10" + selector], "PM10",value.connected);
                    break;
                }


              })
            }, 1000) // end am5.ready()


          })
          .addTo(nebuleairParticuliers).setZIndexOffset(-1000);
      }
    }
  });
}

function load1NebuleAir(id, hours, timespan) {

  console.log("%cNebuleAir 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(start_string);
  console.log(end_string);

  console.log(id);

  let chartTitleText = "";
  chartTitleText += "NebuleAir-" + id + ", moyennes";

  switch (timespan) {
    case 2:
      chartTitleText += " à 2 minutes, ";
      break;
    case 15:
      chartTitleText += " quart-horaires, ";
      break;
    case 60:
      chartTitleText += " horaires, ";
      break;
    case 1440:
      chartTitleText += " journalières, ";
      break;
  }

  chartTitleText += "µg/m3";

  $.ajax({
    method: "GET",
    url: "../php_scripts/NebuleAir_1sensor.php",
    data: ({
      id: id,
      debut: start_string,
      fin: end_string,
      timespan: timespan
    }),
  }).done(function (data) {
    console.log(data);

    // if (data == null) {

    if (root4 != undefined) {
        console.log("DISPOSE")
        root4.dispose();
      }

      setTimeout(function () {
        am5.ready(function () {
          root4 = am5.Root.new("chartSensor2");
          graphCreatorNebuleAir(root4, data, chartTitleText);
        })
      }, 1000); // end am5.ready()
  })
    .fail(function () {
      console.log("Error while geting data from Aircarto API");
    });
}

function load1NebuleAirModal(id, hours, timespan) {

  console.log("%cNebuleAir 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(start_string);
  console.log(end_string);

  console.log(id);

  var chartTitleText = "";
  chartTitleText += "NebuleAir-" + id + ", moyennes";

  switch (timespan) {
    case 2:
      chartTitleText += " à 2 minutes, ";
      break;
    case 15:
      chartTitleText += " quart-horaires, ";
      break;
    case 60:
      chartTitleText += " horaires, ";
      break;
    case 1440:
      chartTitleText += " journalières, ";
      break;
  }

  chartTitleText += "µg/m3";

  $.ajax({
    method: "GET",
    url: "../php_scripts/NebuleAir_1sensor.php",
    data: ({
      id: id,
      debut: start_string,
      fin: end_string,
      timespan: timespan
    }),
  }).done(function (data) {

      if (root4 != undefined) {
        console.log("DISPOSE")
        root4.dispose();
      }

      setTimeout(function () {
        am5.ready(function () {

          // Create root element
          // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
          root4 = am5.Root.new("modal_chartSensor2");

          graphCreatorNebuleAir(root4, data, chartTitleText);

        })
      }, 1000); // end am5.ready()
  })
    .fail(function () {
      console.log("Error while geting data from Aircarto API");
    });
}

function switchNebuleAir() {
  if (
    document.querySelector("#checkbox_micro_stationsParticuliers").checked
  ) {
    if (
      apiFetchNebuleAir.data.length == 0 ||
      (apiFetchNebuleAir.data.length != 0 &&
        apiFetchNebuleAir.timespan != timespanLower)
    ) {
      console.log("Reload NebuleAir!");
      loadNebuleAir();
    } else {
      if (
        apiFetchNebuleAir.data.length == 0 ||
        (apiFetchNebuleAir.data.length != 0 &&
          Date.now() - apiFetchNebuleAir.timestamp >
            timespanLower * 60 * 1000)
      ) {
        console.log("Reload NebuleAir!");
        loadNebuleAir();
      }
    }
    map.addLayer(nebuleairParticuliers);
  } else {
    map.removeLayer(nebuleairParticuliers);
  }
  setQueryString();
}

function chooseTimeNebuleAir(sensor, hours, timespan, modal) {
  timeLengthGraph = hours;
  timespanGraph = timespan;
  console.log(sensor);
  console.log(hours);
  console.log(timespan);

  if (!modal) {
    switch (timespan) {
      case 2:
        var tempo = " à 2 minutes ";
        break;
      case 15:
        var tempo = " quart-horaires ";
        break;
      case 60:
        var tempo = " horaires ";
        break;
      case 1440:
        var tempo = " journalières ";
        break;
    }

    document.getElementById("card-title").innerText =
      "Evolution des concentrations" +
      tempo +
      "en particules fines (µg/m3)";
    load1NebuleAir(sensor, timeLengthGraph, timespanGraph);
    document.getElementById("button1h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',1," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("button3h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',3," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">3h</button>';
    document.getElementById("button24h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',24," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">24h</button>';
    document.getElementById("button48h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',48," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">48h</button>';
    document.getElementById("button1s").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',168," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
    document.getElementById("button1m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',720," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
    document.getElementById("button1a").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',8760," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 an</button>';
    document.getElementById("button2m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',2,false)" class="btn btn-outline-secondary btn-sm">2m</button>';
    document.getElementById("button15m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',15,false)" class="btn btn-outline-secondary btn-sm">15m</button>';
    document.getElementById("button60m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',60,false)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("button1440m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',1440,false)" class="btn btn-outline-secondary btn-sm">24h</button>';
    buttonsSwitcher(timeLengthGraph, timespanGraph, modal);
    if (timespanGraph == 2 || timespanGraph == 15) {
      document
        .getElementById("button1a")
        .children[0].setAttribute("disabled", "");
    } else {
      document
        .getElementById("button1a")
        .children[0].removeAttribute("disabled");
    }

    if (timeLengthGraph == 8760) {
      document
        .getElementById("button2m")
        .children[0].setAttribute("disabled", "");
      document
        .getElementById("button15m")
        .children[0].setAttribute("disabled", "");
    } else {
      document
        .getElementById("button2m")
        .children[0].removeAttribute("disabled");
      document
        .getElementById("button15m")
        .children[0].removeAttribute("disabled");
    }
  } else {
    load1NebuleAirModal(sensor, timeLengthGraph, timespanGraph);
    document.getElementById("modal_button1h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',1," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("modal_button3h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',3," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">3h</button>';
    document.getElementById("modal_button24h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',24," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">24h</button>';
    document.getElementById("modal_button48h").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',48," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">48h</button>';
    document.getElementById("modal_button1s").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',168," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
    document.getElementById("modal_button1m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',720," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
    document.getElementById("modal_button1a").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "',8760," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 an</button>';
    document.getElementById("modal_button2m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',2,true)" class="btn btn-outline-secondary btn-sm">2m</button>';
    document.getElementById("modal_button15m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',15,true)" class="btn btn-outline-secondary btn-sm">15m</button>';
    document.getElementById("modal_button60m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',60,true)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("modal_button1440m").innerHTML =
      '<button type="button" onclick="chooseTimeNebuleAir(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',1440,true)" class="btn btn-outline-secondary btn-sm">24h</button>';
    buttonsSwitcher(timeLengthGraph, timespanGraph, modal);
    if (timespanGraph == 2 || timespanGraph == 15) {
      document
        .getElementById("modal_button1a")
        .children[0].setAttribute("disabled", "");
    } else {
      document
        .getElementById("modal_button1a")
        .children[0].removeAttribute("disabled");
    }

    if (timeLengthGraph == 8760) {
      document
        .getElementById("modal_button2m")
        .children[0].setAttribute("disabled", "");
      document
        .getElementById("modal_button15m")
        .children[0].setAttribute("disabled", "");
    } else {
      document
        .getElementById("modal_button2m")
        .children[0].removeAttribute("disabled");
      document
        .getElementById("modal_button15m")
        .children[0].removeAttribute("disabled");
    }
  }
}

function gaugeCreatorNebuleAir(root, measure, type, connected) {
  console.log(root.dom);
  // console.log(parseFloat(measure));
  // console.log(connected);

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 160,
      endAngle: 380,
    })
  );

  let axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -20,
    minGridDistance: 50,
  });

  axisRenderer.grid.template.setAll({
    stroke: root.interfaceColors.get("background"),
    visible: false,
    strokeOpacity: 0.8,
  });

  let maximum;

  switch (type) {
    case "PM1":
      maximum = 100;
      break;
    case "PM25":
      maximum = 100;
      break;
    case "PM10":
      maximum = 200;
      break;
  }

  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: maximum,
      strictMinMax: true,
      renderer: axisRenderer,
    })
  );

  let axisDataItem = xAxis.makeDataItem({});

  let clockHand = am5radar.ClockHand.new(root, {
    pinRadius: am5.percent(20),
    radius: am5.percent(35),
    bottomWidth: 20,
  });

  let bullet = axisDataItem.set(
    "bullet",
    am5xy.AxisBullet.new(root, {
      sprite: clockHand,
    })
  );

  xAxis.createAxisRange(axisDataItem);

  let label = chart.radarContainer.children.push(
    am5.Label.new(root, {
      fill: am5.color(0xffffff),
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "1em",
    })
  );

  axisDataItem.set("value", 0);
  bullet.get("sprite").on("rotation", function () {
    let value = axisDataItem.get("value");
    let text = Math.round(axisDataItem.get("value")).toString();
    let fill = am5.color(0x000000);
    xAxis.axisRanges.each(function (axisRange) {
      if (
        value >= axisRange.get("value") &&
        value <= axisRange.get("endValue")
      ) {
        fill = axisRange.get("axisFill").get("fill");
      }
    });

    if(connected){
    label.set("text", Math.round(value).toString());
    }else{
    label.set("text", "N/A");
    }

    clockHand.pin.animate({
      key: "fill",
      to: fill,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
    clockHand.hand.animate({
      key: "fill",
      to: fill,
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
  });

  if(connected){
  setTimeout(function () {
    axisDataItem.animate({
      key: "value",
      to: Math.round(parseFloat(measure)),
      duration: 500,
      easing: am5.ease.out(am5.ease.cubic),
    });
  }, 1000);
  }else{
    root.dom.style.opacity = 0.2;
    root.dom.style.filter = "alpha(opacity = 20)";
  }

  chart.bulletsContainer.set("mask", undefined);

  // if (type =="PM25"){

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
    let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

    axisRange.setAll({
      value: data.lowScore,
      endValue: data.highScore,
    });

    axisRange.get("axisFill").setAll({
      visible: true,
      fill: am5.color(data.color),
      fillOpacity: 1,
    });
  });

  chart.children.unshift(
    am5.Label.new(root, {
      text: "µg/m³",
      fontSize: 10,
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 15,
    })
  );

  chart.children.unshift(
    am5.Label.new(root, {
      text: title,
      fontSize: 15,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0,
    })
  );

  chart.appear(1000, 100);

  xAxis.get("renderer").grid.template.set("forceHidden", true);
}

function graphCreatorNebuleAir(root, data, text) {

if (data == null){

  root.setThemes([
    am5themes_Animated.new(root4)
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


  let modal = am5.Modal.new(root, {
    content: "Pas de donnée sur cette période"
  });

  modal.open();

  let legend = chart.bottomAxesContainer.children.push(am5.Legend.new(root, {
    width: 400,
    height: am5.percent(20),
    layout: root.horizontalLayout,
  }));


  // When legend item container is hovered, dim all the series except the hovered one
  legend.itemContainers.template.events.on("pointerover", function (e) {
    let itemContainer = e.target;

    // As series list is data of a legend, dataContext is series
    var series = itemContainer.dataItem.dataContext;

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


  let exporting = am5plugins_exporting.Exporting.new(root, {
    menu: am5plugins_exporting.ExportingMenu.new(root, {}),
    dataSource: data
  });

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  chart.appear(1000, 100);

}else{

  let data_PM1 = data.map(function (e) {
    return { value: e.PM1, date: new Date(e.time).getTime() }
  });
  let data_PM25 = data.map(function (e) {
    return { value: e.PM25, date: new Date(e.time).getTime() }
  });
  let data_PM10 = data.map(function (e) {
    return { value: e.PM10, date: new Date(e.time).getTime() }
  });

  // Set themes
          // https://www.amcharts.com/docs/v5/concepts/themes/ 
          root.setThemes([
            am5themes_Animated.new(root)
          ]);


          // Create chart
          // https://www.amcharts.com/docs/v5/charts/xy-chart/
          let chart = root.container.children.push(am5xy.XYChart.new(root4, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            maxTooltipDistance: 0,
            // maxTooltipDistanceBy: "x",
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
          legend.valueLabels.template.set("forceHidden", true);

          // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
          legend.data.setAll(chart.series.values);

          chart.children.unshift(am5.Label.new(root, {
            text: text,
            fontSize: 14,
            textAlign: "center",
            x: am5.percent(50),
            centerX: am5.percent(50)
          }));

          let exporting = am5plugins_exporting.Exporting.new(root, {
            menu: am5plugins_exporting.ExportingMenu.new(root, {}),
            dataSource: data
          });

          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          chart.appear(1000, 100);

}
}