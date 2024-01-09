function loadStationRefAtmo() {AtmoSudMicro_1
  console.log("%cAtmoSud Ref", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const start = Date.now();
  stationsRefAtmoSud.clearLayers();

  $.ajax({
    method: "GET",
    url: "../php_scripts/AtmoSudRefList.php",
  }).done(function (data) {
    apiFetchAtmoSudRefList = data.stations;

    console.log(data);

    $.each(data.stations, function (key, item) {

      // console.log(item.variables);

      var AtmoSudRefPopupList = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
        '<div class="text-center" style="padding-top:15px">' +
        '<h1>' + item.nom_station + '</h1>' +
        '<br>Mesures pour : <br>' +
        '<br>' + compoundList(item.variables) + '<br>' +
        '<br><button class="btn btn-outline-primary" style="margin-right:5px;"  onclick="window.open(\'https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=' + item.id_station + '\',\'_blank\')">stationRefAtmoSud-' + item.id_station + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'stationRefAtmoSud-' + item.id_station + '\')">Voir les données</button>' +
        '</div>';


      // document.getElementById("btn_popup_list_"+item.id_station).onclick = function() {window.open("https://www.atmosud.org/dataviz/mesures-aux-stations?station_id="+ item.id_station, "_blank");};


      var AtmoSudRefTootip = item.nom_station;

      var icon_param = {
        iconUrl: 'img/refStationsAtmoSud/refStationAtmoSud_default.png',
        iconSize: [80, 80], // size of the icon
        iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
        //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
        className: item.id_station,
      }

      var refStationsAtmoSud_icon = L.icon(icon_param);

      if (!isMobile) {
        L.marker([item['latitude'], item['longitude']], { icon: refStationsAtmoSud_icon })
          .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
          .bindPopup(AtmoSudRefPopupList, {
            maxWidth: 4000
          })
          .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
      } else {
        L.marker([item['latitude'], item['longitude']], { icon: refStationsAtmoSud_icon })
          .on('click', function () {
            document.getElementById("modal2_sensorid").innerHTML = "Station AtmoSud-" + item.nom_station;
            document.getElementById("modal_sensorid").onclick = function () { window.open("https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=" + item.id_station, "_blank"); };
            document.getElementById("modal2_list").innerHTML = "Mesures : <br>" + compoundList(item.variables);
            sensorPanelModal2.show();
          })
          .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
      }
    })


    $.ajax({
      method: "GET",
      url: "../php_scripts/AtmoSudRef.php",
      data: ({ timespan: timespanLower }),
    }).done(function (data) {
      const end = Date.now();
      const requestTimer = (end - start) / 1000;
      console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
      console.log(data.mesures);

      apiFetchAtmoSudRef.data = data.mesures;
      apiFetchAtmoSudRef.timestamp = end;
      apiFetchAtmoSudRef.timespan = timespanLower;

      $.each(data.mesures, function (key, item) {

        var value_compound;

        switch (compoundUpper) {
          case "PM1":
            if (item.polluant_id == "68") {
              if (item.valeur != null) {
                value_compound = Math.round(item["valeur"]);
              } else { value_compound = -1; }
            }
            break;
          case "PM25":
            if (item.polluant_id == "39") {
              if (item.valeur != null) {
                value_compound = Math.round(item["valeur"]);
              } else { value_compound = -1; }
            }
            break;
          case "PM10":
            if (item.polluant_id == "24") {
              if (item.valeur != null) {
                value_compound = Math.round(item["valeur"]);
              } else { value_compound = -1; }
            }
            break;
        }

        var AtmoSudRefPopup = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
          '<div id="gauges">' +
          '<div id="chartdiv1"></div>' +
          '<div id="chartdiv2"></div>' +
          '<div id="chartdiv3"></div>' +
          '</div>' +
          '<div class="text-center" style="padding-top:15px">' +
          '<h1>' + item.nom_station + '</h1>' +
          '<br>Dernière mesure effectuée :' + timeDateCounter(item.date_debut) + '<br>' +
          '<br><button class="btn btn-outline-primary" style="margin-right:5px;"  onclick="window.open(\'https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=' + item.id_station + '\',\'_blank\')">stationRefAtmoSud-' + item.id_station + '</button>' +
          '<button class="btn btn-primary" onclick="OpenSidePanel(\'stationRefAtmoSud-' + item.id_station + '\')">Voir les données</button>' +
          '</div>';

        var AtmoSudRefTootip = item.nom_station;

        if ((item.polluant_id == "68" || item.polluant_id == "39" || item.polluant_id == "24") && value_compound != undefined) {

          var icon_param = {
            iconUrl: 'img/refStationsAtmoSud/refStationAtmoSud_default.png',
            iconSize: [80, 80], // size of the icon
            iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
            //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
          }

          // //change icon color for PM1 and PM25

          //BON
          if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_bon.png';
          }
          //MOYEN
          if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_moyen.png';
          }
          //DEGRADE
          if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_degrade.png';
          }
          //MAUVAIS
          if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_mauvais.png';
          }
          //TRES MAUVAIS
          if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_tresMauvais.png';
          }
          //extr MAUVAIS
          if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_extMauvais.png';
          }


          //change icon color for PM1 and PM25
          //BON
          if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_bon.png';
          }
          //MOYEN
          if (value_compound >= 20 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_moyen.png';
          }
          //DEGRADE
          if (value_compound >= 40 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_degrade.png';
          }
          //MAUVAIS
          if (value_compound >= 50 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_mauvais.png';
          }
          //TRES MAUVAIS
          if (value_compound >= 100 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_tresMauvais.png';
          }
          //extr MAUVAIS
          if (value_compound >= 150 && compoundUpper == "PM10") {
            icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_extMauvais.png';
          }

          // //add icon to map
          var refStationsAtmoSud_icon = L.icon(icon_param);

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


          if (value_compound != undefined && value_compound != -1) {

            stationsRefAtmoSud.eachLayer(function (layer) {
              if (layer._icon.className.includes(item.id_station) && item.valeur != null) {
                console.log("REMOVED LAYER");
                stationsRefAtmoSud.removeLayer(layer)
              }
            })

            // cutom text on the marker
            var myIcon = L.divIcon({
              className: 'my-div-icon',
              html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
              iconAnchor: [x_position, y_position],
              popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });

            L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
              .addTo(stationsRefAtmoSud);


            if (!isMobile) {
              L.marker([item['lat'], item['lon']], { icon: myIcon })
                .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
                .bindPopup(AtmoSudRefPopup, {
                  maxWidth: 4000
                })
                .on('click', function () {

                  var filtered = data.mesures.filter((e) => e.id_station == item.id_station);

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

                      console.log(filtered.filter((e) => e.polluant_id == "68"));
                      console.log(filtered);

                      gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                      gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                      gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);

                    })
                  }, 1000) // end am5.ready()
                })
                .addTo(stationsRefAtmoSud);
            } else {
              L.marker([item['lat'], item['lon']], { icon: myIcon })
                .on('click', function () {
                  var filtered = data.mesures.filter((e) => e.id_station == item.id_station);

                  modalCreator("atmosudref", item.id_station, timeDateCounter(item.date_debut), -1, item.nom_station);
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
                          gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                          break;
                        case "PM25":
                          gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                          break;
                        case "PM10":
                          gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);
                          break;
                      }
                    })
                  })
                })
                .addTo(stationsRefAtmoSud);

            }

          } else {

            stationsRefAtmoSud.eachLayer(function (layer) {
              if (layer._icon.className.includes(item.id_station) && item.valeur != null) {
                console.log("REMOVED LAYER");
                stationsRefAtmoSud.removeLayer(layer)
              }
            })

            // cutom text on the marker
            var myIcon = L.divIcon({
              className: 'my-div-icon',
              // html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + ' ' + '</div>',
              html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
              iconAnchor: [x_position, y_position],
              popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });

            if (!isMobile) {
              L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
                .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
                .bindPopup(AtmoSudRefPopup, {
                  maxWidth: 4000
                })
                .on('click', function () {

                  var filtered = data.mesures.filter((e) => e.id_station == item.id_station);

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

                      gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                      gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                      gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);

                    })
                  }, 1000) // end am5.ready()
                })
                .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
            } else {
              L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
                .on('click', function () {
                  var filtered = data.mesures.filter((e) => e.id_station == item.id_station);
                  modalCreator("atmosudref", item.id_station, timeDateCounter(item.date_debut), -1, item.nom_station);
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
                          gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                          break;
                        case "PM25":
                          gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                          break;
                        case "PM10":
                          gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);
                          break;
                      }


                    })
                  })

                })
                .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);



            }

          }
        }
      })
    })
      .fail(function () {
        console.log("Error while geting data from AtmoSud API");
      })



  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    })

}

function changeStationRefAtmo() {

  $.each(apiFetchAtmoSudRefList, function (key, item) {

    console.log(item.variables);

    var AtmoSudRefPopupList = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
      '<div class="text-center" style="padding-top:15px">' +
      '<h1>' + item.nom_station + '</h1>' +
      '<br>Mesures pour : <br>' +
      '<br>' + compoundList(item.variables) + '<br>' +
      '<br><button class="btn btn-outline-primary" style="margin-right:5px;"  onclick="window.open(\'https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=' + item.id_station + '\',\'_blank\')">stationRefAtmoSud-' + item.id_station + '</button>' +
      '<button class="btn btn-primary" onclick="OpenSidePanel(\'stationRefAtmoSud-' + item.id_station + '\')">Voir les données</button>' +
      '</div>';

    var AtmoSudRefTootip = item.nom_station;

    var icon_param = {
      iconUrl: 'img/refStationsAtmoSud/refStationAtmoSud_default.png',
      iconSize: [80, 80], // size of the icon
      iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
      //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
      className: item.id_station,
    }

    var refStationsAtmoSud_icon = L.icon(icon_param);



    if (!isMobile) {
      L.marker([item['latitude'], item['longitude']], { icon: refStationsAtmoSud_icon })
        .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
        .bindPopup(AtmoSudRefPopupList, {
          maxWidth: 4000
        })
        .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
    } else {
      L.marker([item['latitude'], item['longitude']], { icon: refStationsAtmoSud_icon })
        .on('click', function () {
          document.getElementById("modal2_sensorid").innerHTML = "Station AtmoSud-" + item.nom_station;
          document.getElementById("modal_sensorid").onclick = function () { window.open("https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=" + item.id_station, "_blank"); };
          document.getElementById("modal2_list").innerHTML = "Mesures : <br>" + compoundList(item.variables);
          sensorPanelModal2.show();
        })
        .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
    }
  })
  $.each(apiFetchAtmoSudRef.data, function (key, item) {

    // stationsRefAtmoSud.eachLayer(function (layer) {
    //   if (layer._icon.className.includes(item.id_station) && item.valeur != null){
    //     console.log("REMOVED LAYER");
    //     stationsRefAtmoSud.removeLayer(layer)
    //   }  
    // })


    var value_compound;

    switch (compoundUpper) {
      case "PM1":
        if (item.polluant_id == "68") {
          if (item.valeur != null) {
            value_compound = Math.round(item["valeur"]);
          } else { value_compound = -1; }
        }
        break;
      case "PM25":
        if (item.polluant_id == "39") {
          if (item.valeur != null) {
            value_compound = Math.round(item["valeur"]);
          } else { value_compound = -1; }
        }
        break;
      case "PM10":
        if (item.polluant_id == "24") {
          if (item.valeur != null) {
            value_compound = Math.round(item["valeur"]);
          } else { value_compound = -1; }
        }
        break;
    }

    var AtmoSudRefPopup = '<img src="img/LogoAtmoSud.png" alt="" class="card-img-top">' +
      '<div id="gauges">' +
      '<div id="chartdiv1"></div>' +
      '<div id="chartdiv2"></div>' +
      '<div id="chartdiv3"></div>' +
      '</div>' +
      '<div class="text-center" style="padding-top:15px">' +
      '<h1>' + item.nom_station + '</h1>' +
      '<br>Dernière mesure effectuée :' + timeDateCounter(item.date_debut) + '<br>' +
      '<br><button class="btn btn-outline-primary" style="margin-right:5px;"  onclick="window.open(\'https://www.atmosud.org/dataviz/mesures-aux-stations?station_id=' + item.id_station + '\',\'_blank\')">stationRefAtmoSud-' + item.id_station + '</button>' +
      '<button class="btn btn-primary" onclick="OpenSidePanel(\'stationRefAtmoSud-' + item.id_station + '\')">Voir les données</button>' +
      '</div>';

    var AtmoSudRefTootip = item.nom_station;

    if ((item.polluant_id == "68" || item.polluant_id == "39" || item.polluant_id == "24") && value_compound != undefined) {

      var icon_param = {
        iconUrl: 'img/refStationsAtmoSud/refStationAtmoSud_default.png',
        iconSize: [80, 80], // size of the icon
        iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
        //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
      }

      // //change icon color for PM1 and PM25

      //BON
      if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_bon.png';
      }
      //MOYEN
      if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_tresMauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_extMauvais.png';
      }


      //change icon color for PM1 and PM25
      //BON
      if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_bon.png';
      }
      //MOYEN
      if (value_compound >= 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 40 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 50 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 100 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_tresMauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 150 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/refStationsAtmoSud/refStationAtmoSud_extMauvais.png';
      }

      // //add icon to map
      var refStationsAtmoSud_icon = L.icon(icon_param);

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


      if (value_compound != undefined && value_compound != -1) {

        stationsRefAtmoSud.eachLayer(function (layer) {
          if (layer._icon.className.includes(item.id_station) && item.valeur != null) {
            stationsRefAtmoSud.removeLayer(layer)
          }
        })

        // cutom text on the marker
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });
        L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
          .addTo(stationsRefAtmoSud);


        if (!isMobile) {
          L.marker([item['lat'], item['lon']], { icon: myIcon })
            .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
            .bindPopup(AtmoSudRefPopup, {
              maxWidth: 4000
            })
            .on('click', function () {

              var filtered = apiFetchAtmoSudRef.data.filter((e) => e.id_station == item.id_station);

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

                  gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                  gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                  gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);

                })
              }, 1000) // end am5.ready()
            })
            .addTo(stationsRefAtmoSud);
        } else {
          L.marker([item['lat'], item['lon']], { icon: myIcon })
            .on('click', function () {
              var filtered = data.mesures.filter((e) => e.id_station == item.id_station);
              modalCreator("atmosudref", item.id_station, timeDateCounter(item.date_debut), -1, item.nom_station);

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
                      gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                      break;
                    case "PM25":
                      gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                      break;
                    case "PM10":
                      gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);
                      break;
                  }

                })
              })


            })
            .addTo(stationsRefAtmoSud);
        }

      } else {
        // cutom text on the marker

        stationsRefAtmoSud.eachLayer(function (layer) {
          if (layer._icon.className.includes(item.id_station) && item.valeur != null) {
            console.log("REMOVED LAYER");
            stationsRefAtmoSud.removeLayer(layer)
          }
        })

        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

        });



        if (!isMobile) {
          L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
            .bindTooltip(AtmoSudRefTootip, { direction: 'center' })
            .bindPopup(AtmoSudRefPopup, {
              maxWidth: 4000
            })
            .on('click', function () {

              var filtered = apiFetchAtmoSudRef.data.filter((e) => e.id_station == item.id_station);

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

                  gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                  gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                  gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);

                })
              }, 1000) // end am5.ready()
            })
            .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);
        } else {
          L.marker([item['lat'], item['lon']], { icon: refStationsAtmoSud_icon })
            .on('click', function () {
              var filtered = data.mesures.filter((e) => e.id_station == item.id_station);

              modalCreator("atmosudref", item.id_station, timeDateCounter(item.date_debut), -1, item.nom_station);

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
                      gaugeCreatorAtmoSudRef(root1,filtered,"PM1",value_compound);
                      break;
                    case "PM25":
                      gaugeCreatorAtmoSudRef(root2,filtered,"PM25",value_compound);
                      break;
                    case "PM10":
                      gaugeCreatorAtmoSudRef(root3,filtered,"PM10",value_compound);
                      break;
                  }
                })
              })

            })
            .addTo(stationsRefAtmoSud).setZIndexOffset(-1000);


        }

      }
    }

  })

}

function load1RefAtmo(id, hours, timespan) {

  console.log("%cAtmoSud Ref 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log("Station id:".id);
  console.log(hours);
  console.log(start_string);
  console.log(end_string);
  console.log(timespanLower);

  //ATTENTION, ON EST EN UTC + pour journalière enlever un autre jour ?

  let chartTitleText = "";
  chartTitleText += "AtmoSudRef-" + id + ", moyennes ";

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
    url: "../php_scripts/AtmoSudRef_1sensor.php",
    data: ({
      id_site: id,
      debut: start_string,
      fin: end_string,
      timespan: timespan
    }),
  }).done(function (data) {
    console.log(data);

    var filter_PM1 = data.mesures.filter((e) => e.polluant_id == "68");
    var filter_PM25 = data.mesures.filter((e) => e.polluant_id == "39");
    var filter_PM10 = data.mesures.filter((e) => e.polluant_id == "24");


    var data_PM1 = filter_PM1.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }  //+ 60*60*1000 to get date_fin ? + UTC automatique?
    });
    var data_PM25 = filter_PM25.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }
    });
    var data_PM10 = filter_PM10.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }
    });

    console.log(data_PM1);
    console.log(data_PM25);
    console.log(data_PM10);


    if (root4 != undefined) {
      console.log("DISPOSE")
      root4.dispose();
    }


    setTimeout(function () {
      am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
        root4 = am5.Root.new("chartSensor2");
        graphCreatorAtmoSudRef(root4, data_PM1, data_PM25, data_PM10, chartTitleText, data.mesures);
      })
    }, 1000); // end am5.ready()

  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    });
}

function load1RefAtmoModal(id, hours, timespan) {

  console.log("%cAtmoSud Ref 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(id);
  console.log(hours);
  console.log(start_string);
  console.log(end_string);
  console.log(timespanLower);

  //ATTENTION, ON EST EN UTC + pour journalière enlever un autre jour ?

  let chartTitleText = "";
  chartTitleText += "AtmoSudRef-" + id + ", moyennes ";

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
    url: "../php_scripts/AtmoSudRef_1sensor.php",
    data: ({
      id_site: id,
      debut: start_string,
      fin: end_string,
      timespan: timespan
    }),
  }).done(function (data) {
    console.log(data);

    var filter_PM1 = data.mesures.filter((e) => e.polluant_id == "68");
    var filter_PM25 = data.mesures.filter((e) => e.polluant_id == "39");
    var filter_PM10 = data.mesures.filter((e) => e.polluant_id == "24");


    var data_PM1 = filter_PM1.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }  //+ 60*60*1000 to get date_fin ? + UTC automatique?
    });
    var data_PM25 = filter_PM25.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }
    });
    var data_PM10 = filter_PM10.map(function (e) {
      return { value: e.valeur, date: new Date(e.date_debut).getTime() }
    });

    console.log(data_PM1);
    console.log(data_PM25);
    console.log(data_PM10);


    if (root4 != undefined) {
      console.log("DISPOSE")
      root4.dispose();
    }


    setTimeout(function () {
      am5.ready(function () {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
        root4 = am5.Root.new("modal_chartSensor2");
        graphCreatorAtmoSudRef(root4, data_PM1, data_PM25, data_PM10, chartTitleText, data.mesures);
      })
    }, 1000); // end am5.ready()

  })
    .fail(function () {
      console.log("Error while geting data from AtmoSud API");
    });
}

function compoundList(json) {
  let list = '<ul id="compoundList">';

  if (json["01"] != undefined) { list += "<li>SO2</li>" }
  if (json["02"] != undefined) { list += "<li>NO</li>" }
  if (json["03"] != undefined) { list += "<li>NO2</li>" }
  if (json["04"] != undefined) { list += "<li>CO</li>" }
  if (json["05"] != undefined) { list += "<li>H2S</li>" }
  if (json["08"] != undefined) { list += "<li>O3</li>" }
  if (json["0N"] != undefined) { list += "<li>C2H3Cl</li>" }
  if (json["12"] != undefined) { list += "<li>NOx</li>" }
  if (json["16"] != undefined) { list += "<li>CxHx</li>" }
  if (json["17"] != undefined) { list += "<li>CO2</li>" }
  if (json["21"] != undefined) { list += "<li>NH3</li>" }
  if (json["22"] != undefined) { list += "<li>PMtot</li>" }
  if (json["24"] != undefined) { list += "<li>PM10</li>" }
  if (json["39"] != undefined) { list += "<li>PM2.5</li>" }
  if (json["68"] != undefined) { list += "<li>PM1</li>" }
  if (json["85"] != undefined) { list += "<li>Hg</li>" }
  if (json["9H"] != undefined) { list += "<li>Nb PM</li>" }
  if (json["G6"] != undefined) { list += "<li>BC</li>" }
  if (json["GA"] != undefined) { list += "<li>BCwb</li>" }
  if (json["GB"] != undefined) { list += "<li>BCff</li>" }
  if (json["H3"] != undefined) { list += "<li>C2HCl3</li>" }
  if (json["H4"] != undefined) { list += "<li>C2Cl4</li>" }
  if (json["H8"] != undefined) { list += "<li>C4H4Cl2</li>" }
  if (json["H9"] != undefined) { list += "<li>C2H4Cl2</li>" }
  if (json["I2"] != undefined) { list += "<li>SO42-</li>" }
  if (json["I3"] != undefined) { list += "<li>NO3-</li>" }
  if (json["I4"] != undefined) { list += "<li>NH4+</li>" }
  if (json["I5"] != undefined) { list += "<li>Cl2</li>" }
  if (json["OA"] != undefined) { list += "<li>C6H12</li>" }
  if (json["R2"] != undefined) { list += "<li>C8H8</li>" }
  if (json["T1"] != undefined) { list += "<li>Nb PM</li>" }
  if (json["T3"] != undefined) { list += "<li>Nb PM</li>" }
  if (json["V0"] != undefined) { list += "<li>C4H6</li>" }
  if (json["V4"] != undefined) { list += "<li>C6H6</li>" }
  if (json["VA"] != undefined) { list += "<li>C8H10</li>" }
  if (json["VQ"] != undefined) { list += "<li>C7H8</li>" }
  if (json["VU"] != undefined) { list += "<li>C8H10_mp</li>" }
  if (json["VV"] != undefined) { list += "<li>C8H10_ox</li>" }

  return list + '</ul>';
}

function switchRefAtmo() {
  if (timespanLower != 2) {
    if (document.querySelector("#checkbox_stationsRefAtmoSud").checked) {
      //ATTENTION CAS 2mins
      if (
        apiFetchAtmoSudRef.data.length == 0 ||
        (apiFetchAtmoSudRef.data.length != 0 &&
          apiFetchAtmoSudRef.timespan != timespanLower)
      ) {
        console.log("Reload AtmoSud Ref!");
        loadStationRefAtmo();
      } else {
        if (
          apiFetchAtmoSudRef.data.length == 0 ||
          (apiFetchAtmoSudRef.data.length != 0 &&
            apiFetchAtmoSudRef.timespan == timespanLower &&
            Date.now() - apiFetchAtmoSudRef.timestamp >
              timespanLower * 60 * 1000)
        ) {
          console.log("Reload AtmoSud Ref!");
          loadStationRefAtmo();
        }
      }
      map.addLayer(stationsRefAtmoSud);
    } else {
      map.removeLayer(stationsRefAtmoSud);
    }
  } else {
    openToast(
      "Pas de données à intervalle 2 minutes pour les stations de référence AtmoSud"
    );
    document.querySelector(
      "#checkbox_stationsRefAtmoSud"
    ).checked = false;
  }
  setQueryString();
}

function chooseTimeAtmoRef(sensor, hours, timespan, modal) {
  timeLengthGraph = hours;
  timespanGraph = timespan;
  console.log(sensor);
  console.log(hours);
  console.log(timespan);

  if (!modal) {
    load1RefAtmo(sensor, timeLengthGraph, timespanGraph);
    document.getElementById("button1h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "',1," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("button3h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 3," +
      timespanGraph +
      ',false)" class="btn btn-secondary btn-sm">3h</button>';
    document.getElementById("button24h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 24," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">24h</button>';
    document.getElementById("button48h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 48," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">48h</button>';
    document.getElementById("button1s").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 168," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
    document.getElementById("button1m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 720," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
    document.getElementById("button1a").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "',8760," +
      timespanGraph +
      ',false)" class="btn btn-outline-secondary btn-sm">1 an</button>';
    document.getElementById("button2m").innerHTML =
      '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
    document.getElementById("button15m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',15,false)" class="btn btn-outline-secondary btn-sm">15m</button>';
    document.getElementById("button60m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',60,false)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("button1440m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',1440,false)" class="btn btn-outline-secondary btn-sm">24h</button>';

    buttonsSwitcher(timeLengthGraph, timespanGraph, false);
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
    load1RefAtmoModal(sensor, timeLengthGraph, timespanGraph);
    document.getElementById("modal_button1h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "',1," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("modal_button3h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 3," +
      timespanGraph +
      ',true)" class="btn btn-secondary btn-sm">3h</button>';
    document.getElementById("modal_button24h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 24," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">24h</button>';
    document.getElementById("modal_button48h").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 48," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">48h</button>';
    document.getElementById("modal_button1s").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 168," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 semaine</button>';
    document.getElementById("modal_button1m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "', 720," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 mois</button>';
    document.getElementById("modal_button1a").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "',8760," +
      timespanGraph +
      ',true)" class="btn btn-outline-secondary btn-sm">1 an</button>';
    document.getElementById("modal_button2m").innerHTML =
      '<button type="button" class="btn btn-outline-secondary btn-sm" disabled>2m</button>';
    document.getElementById("modal_button15m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',15,true)" class="btn btn-outline-secondary btn-sm">15m</button>';
    document.getElementById("modal_button60m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',60,true)" class="btn btn-outline-secondary btn-sm">1h</button>';
    document.getElementById("modal_button1440m").innerHTML =
      '<button type="button" onclick="chooseTimeAtmoRef(\'' +
      sensor +
      "'," +
      timeLengthGraph +
      ',1440,true)" class="btn btn-outline-secondary btn-sm">24h</button>';

    buttonsSwitcher(timeLengthGraph, timespanGraph, true);
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

function gaugeCreatorAtmoSudRef(root, filtered, type, value_compound){

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

    if (value_compound != undefined && value_compound != -1) {
      label.set("text", Math.round(value).toString());
    } else {
      label.set("text", "N/A");
    }

    clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
    clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
  });


  let indice;

  switch (type) {
    case "PM1":
      indice = "68";
      break;
    case "PM25":
      indice = "39";
      break;
    case "PM10":
      indice = "24";
      break;
  }


  //if (value_compound != undefined && value_compound != -1 && filtered.filter((e) => e.polluant_id == "68")[0] != undefined) { 
  if (value_compound != undefined && value_compound != -1 && filtered.filter((e) => e.polluant_id == indice)[0] != undefined) { 
    setTimeout(function () {
      axisDataItem.animate({
        key: "value",
        to: Math.round(parseFloat(filtered.filter((e) => e.polluant_id == indice)[0].valeur)),
        duration: 500,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }, 1000)
  } else {
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
    let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

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

function graphCreatorAtmoSudRef(root, data1, data2, data3, text, data) {

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
          renderer: am5xy.AxisRendererX.new(root4, {}),
          tooltip: am5.Tooltip.new(root4, {})
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

        // series_PM1.set("stroke", am5.color(0x00ff00));


        series_PM1.data.setAll(data1);
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


        // series_PM25.set("stroke", am5.color(0x0000ff));
        series_PM25.data.setAll(data2);
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

        // series_PM10.set("stroke", am5.color(0xff0000))

        series_PM10.data.setAll(data3);
        series_PM10.appear();

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "none"
        }));
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


        // var legend = chart.children.push(am5.Legend.new(root4, {
        //   centerX: am5.percent(50),
        //   x: am5.percent(50),
        //   layout: am5.GridLayout.new(root, {
        //     maxColumns: 3,
        //     fixedWidthGrid: true
        //   })
        // }));



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

        let exporting = am5plugins_exporting.Exporting.new(root, {
          menu: am5plugins_exporting.ExportingMenu.new(root, {}),
          dataSource: data
        });

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);

  }