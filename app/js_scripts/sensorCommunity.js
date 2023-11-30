function loadSensorCommunity() {
  console.log("%cSensor.Community", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const start = Date.now();
  sensorCommunity.clearLayers();

  $.ajax({
    method: "GET",
    url: "../php_scripts/SensorCommunity.php",
  }).done(function (data) {

    console.log(data);

    var sensors = ["SDS011", "SDS021", "PMS1003", "PMS3003", "PMS5003", "PMS6003", "PMS7003", "HPM", "SPS30", "NextPM", "IPS-7100"];
    var PACA = [10383, 11396, 30225, 54593, 61673, 65706, 67671, 69087, 69315, 69349, 73276, 77775, 79683];

    // var filter_sensors = data.filter((e) => sensors.includes(e.sensor.sensor_type.name)  &&  PACA.includes(e.sensor.id));
    var filter_sensors = data.filter((e) => sensors.includes(e.sensor.sensor_type.name));

    const end = Date.now();
    const requestTimer = (end - start) / 1000;

    console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");

    apiFetchSensorCommunity.data = filter_sensors;
    apiFetchSensorCommunity.timestamp = end;
    apiFetchSensorCommunity.timespan = timespanLower;

    let sensorsList = [];

    $.each(filter_sensors, function (key, item) {

      var value_compound;
      var filtered;

      var sensorCommunityPopup = '<img src="img/LogoSensorCommunity.png" alt="" class="card-img-top">' +
        '<div id="gauges">' +
        '<div id="chartdiv1"></div>' +
        '<div id="chartdiv2"></div>' +
        '<div id="chartdiv3"></div>' +
        '</div>' +
        '<div class="text-center" style="padding-top:15px">' +
        '<br>Dernière mesure effectuée :' + timeDateCounter(item.timestamp) + '<br>' +
        '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">Sensor.Community-' + item.sensor.id + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'Sensor.Community-' + item.sensor.id + '\')">Voir les données</button>' +
        '</div>';

      var sensorCommunityTootip = item.sensor.id.toString();

      switch (compoundUpper) {
        case "PM1":
          filtered = item["sensordatavalues"].filter((e) => e.value_type == "P0");
          if (filtered.length > 0) {
            value_compound = Math.round(filtered[0]["value"]);
          }
          break;
        case "PM25":
          filtered = item["sensordatavalues"].filter((e) => e.value_type == "P2");
          if (filtered.length > 0) {
            value_compound = Math.round(filtered[0]["value"]);
          }
          break;
        case "PM10":
          filtered = item["sensordatavalues"].filter((e) => e.value_type == "P1");
          if (filtered.length > 0) {
            value_compound = Math.round(filtered[0]["value"]);
          }
          break;
      }


      if (!sensorsList.includes(item['sensor']['id'])) {

        sensorsList.push(item['sensor']['id']);

        //image des points sur la carte
        var icon_param = {
          iconUrl: 'img/SensorCommunity/SensorCommunity_default.png',
          iconSize: [80, 80], // size of the icon
          iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
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
        var sc_icon = L.icon(icon_param);

        //textSize (if number under 10)
        var textSize = 45;
        var x_position = -17;
        var y_position = 62;

        //smaller text size if number is greater than 9
        if (value_compound >= 10) {
          textSize = 38;
          x_position = -9;
          y_position = 56;
        }

        //smaller text size if number is greater than 99
        //TODO !!!
        if (value_compound >= 100) {
          textSize = 30;
          x_position = -9;
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

          L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
            .addTo(sensorCommunity)

          //on ajoute le texte sur les points

          if (!isMobile) {

            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
              .bindTooltip(sensorCommunityTootip, { direction: 'center' })
              .bindPopup(sensorCommunityPopup, {
                maxWidth: 4000
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


                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root1.setThemes([
                      am5themes_Animated.new(root1)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer1.grid.template.setAll({
                      stroke: root1.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    // axisRenderer1.ticks.template.setAll({
                    //   visible: true,
                    //   strokeOpacity: 0.5
                    // });

                    var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer1
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem1 = xAxis1.makeDataItem({});

                    var clockHand1 = am5radar.ClockHand.new(root1, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                      sprite: clockHand1
                    }));

                    xAxis1.createAxisRange(axisDataItem1);

                    var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem1.set("value", 0);
                    bullet1.get("sprite").on("rotation", function () {
                      var value1 = axisDataItem1.get("value");
                      var text1 = Math.round(axisDataItem1.get("value")).toString();
                      var fill1 = am5.color(0x000000);
                      xAxis1.axisRanges.each(function (axisRange) {
                        if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                          fill1 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }

                      clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#chartdiv1").style.opacity = 0.2;
                      document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                    }

                    // opacity: 0.6; /* Real browsers */
                    // filter: alpha(opacity = 60); /* MSIE */




                    chart1.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];



                    am5.array.each(bandsData1, function (data) {
                      var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                      axisRange1.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange1.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange1.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root1.interfaceColors.get("background")
                      });
                    });

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "PM1",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart1.appear(1000, 100);


                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root2.setThemes([
                      am5themes_Animated.new(root2)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart2 = root2.container.children.push(am5radar.RadarChart.new(root2, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer2 = am5radar.AxisRendererCircular.new(root2, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer2.grid.template.setAll({
                      stroke: root2.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    var xAxis2 = chart2.xAxes.push(am5xy.ValueAxis.new(root2, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer2
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem2 = xAxis2.makeDataItem({});

                    var clockHand2 = am5radar.ClockHand.new(root2, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root2, {
                      sprite: clockHand2
                    }));

                    xAxis2.createAxisRange(axisDataItem2);

                    var label2 = chart2.radarContainer.children.push(am5.Label.new(root2, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem2.set("value", 0);
                    bullet2.get("sprite").on("rotation", function () {
                      var value2 = axisDataItem2.get("value");
                      var text2 = Math.round(axisDataItem2.get("value")).toString();
                      var fill2 = am5.color(0x000000);
                      xAxis2.axisRanges.each(function (axisRange) {
                        if (value2 >= axisRange.get("value") && value2 <= axisRange.get("endValue")) {
                          fill2 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      label2.set("text", Math.round(value2).toString());

                      clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    setTimeout(function () {
                      axisDataItem2.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)

                    chart2.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData2 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];



                    am5.array.each(bandsData2, function (data) {
                      var axisRange2 = xAxis2.createAxisRange(xAxis2.makeDataItem({}));

                      axisRange2.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange2.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange2.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root2.interfaceColors.get("background")
                      });
                    });

                    chart2.children.unshift(am5.Label.new(root2, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart2.children.unshift(am5.Label.new(root2, {
                      text: "PM2.5",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart2.appear(1000, 100);

                    // // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root3.setThemes([
                      am5themes_Animated.new(root3)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart3 = root3.container.children.push(am5radar.RadarChart.new(root3, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    //                   // Create axis and its renderer
                    //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer3 = am5radar.AxisRendererCircular.new(root3, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer3.grid.template.setAll({
                      stroke: root3.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });


                    var xAxis3 = chart3.xAxes.push(am5xy.ValueAxis.new(root3, {
                      maxDeviation: 0,
                      min: 0,
                      max: 200,
                      strictMinMax: true,
                      renderer: axisRenderer3
                    }));


                    //                   // Add clock hand
                    //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem3 = xAxis3.makeDataItem({});

                    var clockHand3 = am5radar.ClockHand.new(root3, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet3 = axisDataItem3.set("bullet", am5xy.AxisBullet.new(root3, {
                      sprite: clockHand3
                    }));

                    xAxis3.createAxisRange(axisDataItem3);

                    var label3 = chart3.radarContainer.children.push(am5.Label.new(root3, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem3.set("value", 0);
                    bullet3.get("sprite").on("rotation", function () {
                      var value3 = axisDataItem3.get("value");
                      var text3 = Math.round(axisDataItem3.get("value")).toString();
                      var fill3 = am5.color(0x000000);
                      xAxis3.axisRanges.each(function (axisRange) {
                        if (value3 >= axisRange.get("value") && value3 <= axisRange.get("endValue")) {
                          fill3 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      label3.set("text", Math.round(value3).toString());

                      clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    setTimeout(function () {
                      axisDataItem3.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)

                    chart3.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData3 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 20
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 21,
                      highScore: 40
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 41,
                      highScore: 50
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 51,
                      highScore: 100
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 101,
                      highScore: 150
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 151,
                      highScore: 200
                    }
                    ];



                    am5.array.each(bandsData3, function (data) {
                      var axisRange3 = xAxis3.createAxisRange(xAxis3.makeDataItem({}));

                      axisRange3.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange3.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange3.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root3.interfaceColors.get("background")
                      });
                    });


                    chart3.children.unshift(am5.Label.new(root3, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart3.children.unshift(am5.Label.new(root3, {
                      text: "PM10",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));



                    //                   // Make stuff animate on load
                    chart3.appear(1000, 100);

                    xAxis1.get("renderer").grid.template.set("forceHidden", true);
                    xAxis2.get("renderer").grid.template.set("forceHidden", true);
                    xAxis3.get("renderer").grid.template.set("forceHidden", true);

                  })
                }, 1000) // end am5.ready()

              })
              .addTo(sensorCommunity);
          } else {

            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
              .on('click', function () {

                modalCreator("sensorcommunity", item['sensor']['id'], timeDateCounter(item.timestamp), -1);

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

                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root1.setThemes([
                      am5themes_Animated.new(root1)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer1.grid.template.setAll({
                      stroke: root1.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    // axisRenderer1.ticks.template.setAll({
                    //   visible: true,
                    //   strokeOpacity: 0.5
                    // });

                    var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer1
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem1 = xAxis1.makeDataItem({});

                    var clockHand1 = am5radar.ClockHand.new(root1, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                      sprite: clockHand1
                    }));

                    xAxis1.createAxisRange(axisDataItem1);

                    var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem1.set("value", 0);
                    bullet1.get("sprite").on("rotation", function () {
                      var value1 = axisDataItem1.get("value");
                      var text1 = Math.round(axisDataItem1.get("value")).toString();
                      var fill1 = am5.color(0x000000);
                      xAxis1.axisRanges.each(function (axisRange) {
                        if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                          fill1 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      try {
                        console.log(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]);
                      } catch (error) {
                        console.log("NO PM1");
                      }

                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]);
                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]);
                      console.log(compoundUpper == "PM1" && item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined);


                      if (compoundUpper == "PM1") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }


                      if (compoundUpper == "PM25") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }

                      if (compoundUpper == "PM10") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }
                      clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    if (compoundUpper == "PM1") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }

                    if (compoundUpper == "PM25") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }
                    // opacity: 0.6; /* Real browsers */
                    // filter: alpha(opacity = 60); /* MSIE */

                    chart1.bulletsContainer.set("mask", undefined);


                    if (compoundUpper == "PM1" || compoundUpper == "PM25") {
                      // Create axis ranges bands
                      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                      var bandsData1 = [{
                        // title: "Bon",
                        color: "#4FF0E6",
                        lowScore: 0,
                        highScore: 10
                      }, {
                        // title: "Moyen",
                        color: "#51CCAA",
                        lowScore: 11,
                        highScore: 20
                      }, {
                        // title: "Dégradé",
                        color: "#EDE663",
                        lowScore: 21,
                        highScore: 25
                      }, {
                        // title: "Mauvais",
                        color: "#ED5E58",
                        lowScore: 26,
                        highScore: 50
                      }, {
                        // title: "Très mauvais",
                        color: "#881B33",
                        lowScore: 51,
                        highScore: 75
                      }, {
                        // title: "Extr. mauvais",
                        color: "#74287D",
                        lowScore: 76,
                        highScore: 100
                      }
                      ];
                    }

                    if (compoundUpper == "PM10") {
                      // Create axis ranges bands
                      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                      var bandsData1 = [{
                        // title: "Bon",
                        color: "#4FF0E6",
                        lowScore: 0,
                        highScore: 20
                      }, {
                        // title: "Moyen",
                        color: "#51CCAA",
                        lowScore: 21,
                        highScore: 40
                      }, {
                        // title: "Dégradé",
                        color: "#EDE663",
                        lowScore: 41,
                        highScore: 50
                      }, {
                        // title: "Mauvais",
                        color: "#ED5E58",
                        lowScore: 51,
                        highScore: 100
                      }, {
                        // title: "Très mauvais",
                        color: "#881B33",
                        lowScore: 101,
                        highScore: 150
                      }, {
                        // title: "Extr. mauvais",
                        color: "#74287D",
                        lowScore: 151,
                        highScore: 200
                      }
                      ];
                    }



                    am5.array.each(bandsData1, function (data) {
                      var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                      axisRange1.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange1.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      // axisRange1.get("label").setAll({
                      //   text: data.title,
                      //   inside: true,
                      //   radius: 15,
                      //   fontSize: "0.9em",
                      //   fill: root1.interfaceColors.get("background")
                      // });
                    });

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    switch (compoundUpper) {
                      case "PM1":
                        var gaugeText = "PM1";
                        break;
                      case "PM25":
                        var gaugeText = "PM2.5";
                        break;
                      case "PM10":
                        var gaugeText = "PM10";
                        break;
                    }

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: gaugeText,
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart1.appear(1000, 100);

                    xAxis1.get("renderer").grid.template.set("forceHidden", true);

                  })
                }, 1000) // end am5.ready()

              })
              .addTo(sensorCommunity);
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
            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
              .bindTooltip(sensorCommunityTootip, { direction: 'center' })
              .bindPopup(sensorCommunityPopup, {
                maxWidth: 4000
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


                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root1.setThemes([
                      am5themes_Animated.new(root1)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer1.grid.template.setAll({
                      stroke: root1.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    // axisRenderer1.ticks.template.setAll({
                    //   visible: true,
                    //   strokeOpacity: 0.5
                    // });

                    var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer1
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem1 = xAxis1.makeDataItem({});

                    var clockHand1 = am5radar.ClockHand.new(root1, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                      sprite: clockHand1
                    }));

                    xAxis1.createAxisRange(axisDataItem1);

                    var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem1.set("value", 0);
                    bullet1.get("sprite").on("rotation", function () {
                      var value1 = axisDataItem1.get("value");
                      var text1 = Math.round(axisDataItem1.get("value")).toString();
                      var fill1 = am5.color(0x000000);
                      xAxis1.axisRanges.each(function (axisRange) {
                        if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                          fill1 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }

                      clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#chartdiv1").style.opacity = 0.2;
                      document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                    }

                    // opacity: 0.6; /* Real browsers */
                    // filter: alpha(opacity = 60); /* MSIE */




                    chart1.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];



                    am5.array.each(bandsData1, function (data) {
                      var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                      axisRange1.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange1.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange1.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root1.interfaceColors.get("background")
                      });
                    });

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "PM1",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart1.appear(1000, 100);


                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root2.setThemes([
                      am5themes_Animated.new(root2)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart2 = root2.container.children.push(am5radar.RadarChart.new(root2, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer2 = am5radar.AxisRendererCircular.new(root2, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer2.grid.template.setAll({
                      stroke: root2.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    var xAxis2 = chart2.xAxes.push(am5xy.ValueAxis.new(root2, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer2
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem2 = xAxis2.makeDataItem({});

                    var clockHand2 = am5radar.ClockHand.new(root2, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root2, {
                      sprite: clockHand2
                    }));

                    xAxis2.createAxisRange(axisDataItem2);

                    var label2 = chart2.radarContainer.children.push(am5.Label.new(root2, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem2.set("value", 0);
                    bullet2.get("sprite").on("rotation", function () {
                      var value2 = axisDataItem2.get("value");
                      var text2 = Math.round(axisDataItem2.get("value")).toString();
                      var fill2 = am5.color(0x000000);
                      xAxis2.axisRanges.each(function (axisRange) {
                        if (value2 >= axisRange.get("value") && value2 <= axisRange.get("endValue")) {
                          fill2 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      label2.set("text", Math.round(value2).toString());

                      clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    setTimeout(function () {
                      axisDataItem2.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)

                    chart2.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData2 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];



                    am5.array.each(bandsData2, function (data) {
                      var axisRange2 = xAxis2.createAxisRange(xAxis2.makeDataItem({}));

                      axisRange2.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange2.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange2.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root2.interfaceColors.get("background")
                      });
                    });

                    chart2.children.unshift(am5.Label.new(root2, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart2.children.unshift(am5.Label.new(root2, {
                      text: "PM2.5",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart2.appear(1000, 100);

                    // // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root3.setThemes([
                      am5themes_Animated.new(root3)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart3 = root3.container.children.push(am5radar.RadarChart.new(root3, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    //                   // Create axis and its renderer
                    //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer3 = am5radar.AxisRendererCircular.new(root3, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer3.grid.template.setAll({
                      stroke: root3.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });


                    var xAxis3 = chart3.xAxes.push(am5xy.ValueAxis.new(root3, {
                      maxDeviation: 0,
                      min: 0,
                      max: 200,
                      strictMinMax: true,
                      renderer: axisRenderer3
                    }));


                    //                   // Add clock hand
                    //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem3 = xAxis3.makeDataItem({});

                    var clockHand3 = am5radar.ClockHand.new(root3, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet3 = axisDataItem3.set("bullet", am5xy.AxisBullet.new(root3, {
                      sprite: clockHand3
                    }));

                    xAxis3.createAxisRange(axisDataItem3);

                    var label3 = chart3.radarContainer.children.push(am5.Label.new(root3, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem3.set("value", 0);
                    bullet3.get("sprite").on("rotation", function () {
                      var value3 = axisDataItem3.get("value");
                      var text3 = Math.round(axisDataItem3.get("value")).toString();
                      var fill3 = am5.color(0x000000);
                      xAxis3.axisRanges.each(function (axisRange) {
                        if (value3 >= axisRange.get("value") && value3 <= axisRange.get("endValue")) {
                          fill3 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      label3.set("text", Math.round(value3).toString());

                      clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    setTimeout(function () {
                      axisDataItem3.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)

                    chart3.bulletsContainer.set("mask", undefined);


                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData3 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 20
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 21,
                      highScore: 40
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 41,
                      highScore: 50
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 51,
                      highScore: 100
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 101,
                      highScore: 150
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 151,
                      highScore: 200
                    }
                    ];



                    am5.array.each(bandsData3, function (data) {
                      var axisRange3 = xAxis3.createAxisRange(xAxis3.makeDataItem({}));

                      axisRange3.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange3.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      axisRange3.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root3.interfaceColors.get("background")
                      });
                    });


                    chart3.children.unshift(am5.Label.new(root3, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    chart3.children.unshift(am5.Label.new(root3, {
                      text: "PM10",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));



                    //                   // Make stuff animate on load
                    chart3.appear(1000, 100);

                    xAxis1.get("renderer").grid.template.set("forceHidden", true);
                    xAxis2.get("renderer").grid.template.set("forceHidden", true);
                    xAxis3.get("renderer").grid.template.set("forceHidden", true);

                  })
                }, 1000) // end am5.ready()

              })
              .addTo(sensorCommunity).setZIndexOffset(-1000);
          } else {



            // L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
            L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
              .on('click', function () {

                modalCreator("sensorcommunity", item['sensor']['id'], timeDateCounter(item.timestamp), -1);

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

                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root1.setThemes([
                      am5themes_Animated.new(root1)
                    ]);


                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/
                    var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                      panX: false,
                      panY: false,
                      startAngle: 160,
                      endAngle: 380
                    }));


                    // Create axis and its renderer
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                    var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                      innerRadius: -20,
                      minGridDistance: 20
                    });

                    axisRenderer1.grid.template.setAll({
                      stroke: root1.interfaceColors.get("background"),
                      visible: false,
                      strokeOpacity: 0.8
                    });

                    // axisRenderer1.ticks.template.setAll({
                    //   visible: true,
                    //   strokeOpacity: 0.5
                    // });

                    var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                      maxDeviation: 0,
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      renderer: axisRenderer1
                    }));


                    // Add clock hand
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                    var axisDataItem1 = xAxis1.makeDataItem({});

                    var clockHand1 = am5radar.ClockHand.new(root1, {
                      pinRadius: am5.percent(20),
                      radius: am5.percent(35),
                      bottomWidth: 20
                    })

                    var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                      sprite: clockHand1
                    }));

                    xAxis1.createAxisRange(axisDataItem1);

                    var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                      fill: am5.color(0xffffff),
                      centerX: am5.percent(50),
                      textAlign: "center",
                      centerY: am5.percent(50),
                      fontSize: "1em"
                    }));

                    axisDataItem1.set("value", 0);
                    bullet1.get("sprite").on("rotation", function () {
                      var value1 = axisDataItem1.get("value");
                      var text1 = Math.round(axisDataItem1.get("value")).toString();
                      var fill1 = am5.color(0x000000);
                      xAxis1.axisRanges.each(function (axisRange) {
                        if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                          fill1 = axisRange.get("axisFill").get("fill");
                        }
                      })

                      try {
                        console.log(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]);
                      } catch (error) {
                        console.log("NO PM1");
                      }

                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]);
                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]);
                      console.log(compoundUpper == "PM1" && item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined);


                      if (compoundUpper == "PM1") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }


                      if (compoundUpper == "PM25") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }

                      if (compoundUpper == "PM10") {
                        if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {
                          label1.set("text", Math.round(value1).toString());
                        } else {
                          label1.set("text", "N/A");
                        }
                      }
                      clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });

                    if (compoundUpper == "PM1") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }

                    if (compoundUpper == "PM25") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {

                        setTimeout(function () {
                          axisDataItem1.animate({
                            key: "value",
                            to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                            duration: 500,
                            easing: am5.ease.out(am5.ease.cubic)
                          });
                        }, 1000)
                      } else {
                        document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                        document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                      }
                    }
                    // opacity: 0.6; /* Real browsers */
                    // filter: alpha(opacity = 60); /* MSIE */

                    chart1.bulletsContainer.set("mask", undefined);


                    if (compoundUpper == "PM1" || compoundUpper == "PM25") {
                      // Create axis ranges bands
                      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                      var bandsData1 = [{
                        // title: "Bon",
                        color: "#4FF0E6",
                        lowScore: 0,
                        highScore: 10
                      }, {
                        // title: "Moyen",
                        color: "#51CCAA",
                        lowScore: 11,
                        highScore: 20
                      }, {
                        // title: "Dégradé",
                        color: "#EDE663",
                        lowScore: 21,
                        highScore: 25
                      }, {
                        // title: "Mauvais",
                        color: "#ED5E58",
                        lowScore: 26,
                        highScore: 50
                      }, {
                        // title: "Très mauvais",
                        color: "#881B33",
                        lowScore: 51,
                        highScore: 75
                      }, {
                        // title: "Extr. mauvais",
                        color: "#74287D",
                        lowScore: 76,
                        highScore: 100
                      }
                      ];
                    }

                    if (compoundUpper == "PM10") {
                      // Create axis ranges bands
                      // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                      var bandsData1 = [{
                        // title: "Bon",
                        color: "#4FF0E6",
                        lowScore: 0,
                        highScore: 20
                      }, {
                        // title: "Moyen",
                        color: "#51CCAA",
                        lowScore: 21,
                        highScore: 40
                      }, {
                        // title: "Dégradé",
                        color: "#EDE663",
                        lowScore: 41,
                        highScore: 50
                      }, {
                        // title: "Mauvais",
                        color: "#ED5E58",
                        lowScore: 51,
                        highScore: 100
                      }, {
                        // title: "Très mauvais",
                        color: "#881B33",
                        lowScore: 101,
                        highScore: 150
                      }, {
                        // title: "Extr. mauvais",
                        color: "#74287D",
                        lowScore: 151,
                        highScore: 200
                      }
                      ];
                    }



                    am5.array.each(bandsData1, function (data) {
                      var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                      axisRange1.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });

                      axisRange1.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 1
                      });

                      // axisRange1.get("label").setAll({
                      //   text: data.title,
                      //   inside: true,
                      //   radius: 15,
                      //   fontSize: "0.9em",
                      //   fill: root1.interfaceColors.get("background")
                      // });
                    });

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: "µg/m³",
                      fontSize: 10,
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 15,
                    }));

                    switch (compoundUpper) {
                      case "PM1":
                        var gaugeText = "PM1";
                        break;
                      case "PM25":
                        var gaugeText = "PM2.5";
                        break;
                      case "PM10":
                        var gaugeText = "PM10";
                        break;
                    }

                    chart1.children.unshift(am5.Label.new(root1, {
                      text: gaugeText,
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                      x: am5.percent(50),
                      centerX: am5.percent(50),
                      paddingTop: 0,
                      paddingBottom: 0
                    }));

                    // Make stuff animate on load
                    chart1.appear(1000, 100);

                    xAxis1.get("renderer").grid.template.set("forceHidden", true);

                  })
                }, 1000) // end am5.ready()

              })
              .addTo(sensorCommunity).setZIndexOffset(-1000);
          }
        }
      }

    });

  })
    .fail(function () {
      console.log("Error while geting data from AirCarto API");
    });
}

function changeSensorCommunity() {

  let sensorsList = [];

  console.log(apiFetchSensorCommunity.data.length);

  $.each(apiFetchSensorCommunity.data, function (key, item) {

    var value_compound;
    var filtered;

    var sensorCommunityPopup = '<img src="img/LogoSensorCommunity.png" alt="" class="card-img-top">' +
      '<div id="gauges">' +
      '<div id="chartdiv1"></div>' +
      '<div id="chartdiv2"></div>' +
      '<div id="chartdiv3"></div>' +
      '</div>' +
      '<div class="text-center" style="padding-top:15px">' +
      '<br>Dernière mesure effectuée :' + timeDateCounter(item.timestamp) + '<br>' +
      '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">Sensor.Community-' + item.sensor.id + '</button>' +
      '<button class="btn btn-primary" onclick="OpenSidePanel(\'Sensor.Community-' + item.sensor.id + '\')">Voir les données</button>' +
      '</div>';

    var sensorCommunityTootip = item.sensor.id.toString();

    switch (compoundUpper) {
      case "PM1":
        filtered = item["sensordatavalues"].filter((e) => e.value_type == "P0");
        if (filtered.length > 0) {
          value_compound = Math.round(filtered[0]["value"]);
        }
        break;
      case "PM25":
        filtered = item["sensordatavalues"].filter((e) => e.value_type == "P2");
        if (filtered.length > 0) {
          value_compound = Math.round(filtered[0]["value"]);
        }
        break;
      case "PM10":
        filtered = item["sensordatavalues"].filter((e) => e.value_type == "P1");
        if (filtered.length > 0) {
          value_compound = Math.round(filtered[0]["value"]);
        }
        break;
    }

    if (!sensorsList.includes(item['sensor']['id'])) {

      // console.log(item['sensor']['id']);
      sensorsList.push(item['sensor']['id']);

      // console.log("sensor");
      // console.log(sensorsList.length);

      //image des points sur la carte
      var icon_param = {
        iconUrl: 'img/SensorCommunity/SensorCommunity_default.png',
        iconSize: [80, 80], // size of the icon
        iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
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
      var sc_icon = L.icon(icon_param);

      //textSize (if number under 10)
      var textSize = 45;
      var x_position = -17;
      var y_position = 62;

      //smaller text size if number is greater than 9
      if (value_compound >= 10) {
        textSize = 38;
        x_position = -9;
        y_position = 56;
      }

      //smaller text size if number is greater than 99
      //TODO !!!
      if (value_compound >= 100) {
        textSize = 30;
        x_position = -9;
        y_position = 56;
      }




      if (value_compound != undefined && value_compound != null) {
        // custom text on the marker
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
        });

        L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
          .addTo(sensorCommunity);

        //on ajoute le texte sur les points
        if (!isMobile) {

          L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
            .bindTooltip(sensorCommunityTootip, { direction: 'center' })
            .bindPopup(sensorCommunityPopup, {
              maxWidth: 4000
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


                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root1.setThemes([
                    am5themes_Animated.new(root1)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer1.grid.template.setAll({
                    stroke: root1.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  // axisRenderer1.ticks.template.setAll({
                  //   visible: true,
                  //   strokeOpacity: 0.5
                  // });

                  var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer1
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem1 = xAxis1.makeDataItem({});

                  var clockHand1 = am5radar.ClockHand.new(root1, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                    sprite: clockHand1
                  }));

                  xAxis1.createAxisRange(axisDataItem1);

                  var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem1.set("value", 0);
                  bullet1.get("sprite").on("rotation", function () {
                    var value1 = axisDataItem1.get("value");
                    var text1 = Math.round(axisDataItem1.get("value")).toString();
                    var fill1 = am5.color(0x000000);
                    xAxis1.axisRanges.each(function (axisRange) {
                      if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                        fill1 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {

                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv1").style.opacity = 0.2;
                    document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                  }

                  // opacity: 0.6; /* Real browsers */
                  // filter: alpha(opacity = 60); /* MSIE */




                  chart1.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData1 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 10
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 11,
                    highScore: 20
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 21,
                    highScore: 25
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 26,
                    highScore: 50
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 51,
                    highScore: 75
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 76,
                    highScore: 100
                  }
                  ];



                  am5.array.each(bandsData1, function (data) {
                    var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                    axisRange1.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange1.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange1.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root1.interfaceColors.get("background")
                    });
                  });

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "PM1",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart1.appear(1000, 100);


                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root2.setThemes([
                    am5themes_Animated.new(root2)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart2 = root2.container.children.push(am5radar.RadarChart.new(root2, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer2 = am5radar.AxisRendererCircular.new(root2, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer2.grid.template.setAll({
                    stroke: root2.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  var xAxis2 = chart2.xAxes.push(am5xy.ValueAxis.new(root2, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer2
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem2 = xAxis2.makeDataItem({});

                  var clockHand2 = am5radar.ClockHand.new(root2, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root2, {
                    sprite: clockHand2
                  }));

                  xAxis2.createAxisRange(axisDataItem2);

                  var label2 = chart2.radarContainer.children.push(am5.Label.new(root2, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem2.set("value", 0);
                  bullet2.get("sprite").on("rotation", function () {
                    var value2 = axisDataItem2.get("value");
                    var text2 = Math.round(axisDataItem2.get("value")).toString();
                    var fill2 = am5.color(0x000000);
                    xAxis2.axisRanges.each(function (axisRange) {
                      if (value2 >= axisRange.get("value") && value2 <= axisRange.get("endValue")) {
                        fill2 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    label2.set("text", Math.round(value2).toString());

                    clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  setTimeout(function () {
                    axisDataItem2.animate({
                      key: "value",
                      to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)

                  chart2.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData2 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 10
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 11,
                    highScore: 20
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 21,
                    highScore: 25
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 26,
                    highScore: 50
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 51,
                    highScore: 75
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 76,
                    highScore: 100
                  }
                  ];



                  am5.array.each(bandsData2, function (data) {
                    var axisRange2 = xAxis2.createAxisRange(xAxis2.makeDataItem({}));

                    axisRange2.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange2.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange2.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root2.interfaceColors.get("background")
                    });
                  });

                  chart2.children.unshift(am5.Label.new(root2, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart2.children.unshift(am5.Label.new(root2, {
                    text: "PM2.5",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart2.appear(1000, 100);

                  // // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root3.setThemes([
                    am5themes_Animated.new(root3)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart3 = root3.container.children.push(am5radar.RadarChart.new(root3, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  //                   // Create axis and its renderer
                  //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer3 = am5radar.AxisRendererCircular.new(root3, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer3.grid.template.setAll({
                    stroke: root3.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });


                  var xAxis3 = chart3.xAxes.push(am5xy.ValueAxis.new(root3, {
                    maxDeviation: 0,
                    min: 0,
                    max: 200,
                    strictMinMax: true,
                    renderer: axisRenderer3
                  }));


                  //                   // Add clock hand
                  //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem3 = xAxis3.makeDataItem({});

                  var clockHand3 = am5radar.ClockHand.new(root3, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet3 = axisDataItem3.set("bullet", am5xy.AxisBullet.new(root3, {
                    sprite: clockHand3
                  }));

                  xAxis3.createAxisRange(axisDataItem3);

                  var label3 = chart3.radarContainer.children.push(am5.Label.new(root3, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem3.set("value", 0);
                  bullet3.get("sprite").on("rotation", function () {
                    var value3 = axisDataItem3.get("value");
                    var text3 = Math.round(axisDataItem3.get("value")).toString();
                    var fill3 = am5.color(0x000000);
                    xAxis3.axisRanges.each(function (axisRange) {
                      if (value3 >= axisRange.get("value") && value3 <= axisRange.get("endValue")) {
                        fill3 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    label3.set("text", Math.round(value3).toString());

                    clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  setTimeout(function () {
                    axisDataItem3.animate({
                      key: "value",
                      to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)

                  chart3.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData3 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 20
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 21,
                    highScore: 40
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 41,
                    highScore: 50
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 51,
                    highScore: 100
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 101,
                    highScore: 150
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 151,
                    highScore: 200
                  }
                  ];



                  am5.array.each(bandsData3, function (data) {
                    var axisRange3 = xAxis3.createAxisRange(xAxis3.makeDataItem({}));

                    axisRange3.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange3.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange3.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root3.interfaceColors.get("background")
                    });
                  });


                  chart3.children.unshift(am5.Label.new(root3, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart3.children.unshift(am5.Label.new(root3, {
                    text: "PM10",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));
                  //                   // Make stuff animate on load
                  chart3.appear(1000, 100);

                  xAxis1.get("renderer").grid.template.set("forceHidden", true);
                  xAxis2.get("renderer").grid.template.set("forceHidden", true);
                  xAxis3.get("renderer").grid.template.set("forceHidden", true);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(sensorCommunity);
        } else {
          L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
            .on('click', function () {

              modalCreator("sensorcommunity", item['sensor']['id'], timeDateCounter(item.timestamp), -1);

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

                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root1.setThemes([
                    am5themes_Animated.new(root1)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer1.grid.template.setAll({
                    stroke: root1.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  // axisRenderer1.ticks.template.setAll({
                  //   visible: true,
                  //   strokeOpacity: 0.5
                  // });

                  var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer1
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem1 = xAxis1.makeDataItem({});

                  var clockHand1 = am5radar.ClockHand.new(root1, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                    sprite: clockHand1
                  }));

                  xAxis1.createAxisRange(axisDataItem1);

                  var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem1.set("value", 0);
                  bullet1.get("sprite").on("rotation", function () {
                    var value1 = axisDataItem1.get("value");
                    var text1 = Math.round(axisDataItem1.get("value")).toString();
                    var fill1 = am5.color(0x000000);
                    xAxis1.axisRanges.each(function (axisRange) {
                      if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                        fill1 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    try {
                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]);
                    } catch (error) {
                      console.log("NO PM1");
                    }

                    console.log(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]);
                    console.log(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]);
                    console.log(compoundUpper == "PM1" && item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined);


                    if (compoundUpper == "PM1") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }


                    if (compoundUpper == "PM25") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }
                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (compoundUpper == "PM1") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

                  if (compoundUpper == "PM25") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

                  if (compoundUpper == "PM10") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }
                  // opacity: 0.6; /* Real browsers */
                  // filter: alpha(opacity = 60); /* MSIE */

                  chart1.bulletsContainer.set("mask", undefined);


                  if (compoundUpper == "PM1" || compoundUpper == "PM25") {
                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];
                  }

                  if (compoundUpper == "PM10") {
                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 20
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 21,
                      highScore: 40
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 41,
                      highScore: 50
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 51,
                      highScore: 100
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 101,
                      highScore: 150
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 151,
                      highScore: 200
                    }
                    ];
                  }



                  am5.array.each(bandsData1, function (data) {
                    var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                    axisRange1.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange1.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    // axisRange1.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
                  });

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  switch (compoundUpper) {
                    case "PM1":
                      var gaugeText = "PM1";
                      break;
                    case "PM25":
                      var gaugeText = "PM2.5";
                      break;
                    case "PM10":
                      var gaugeText = "PM10";
                      break;
                  }

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: gaugeText,
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart1.appear(1000, 100);

                  xAxis1.get("renderer").grid.template.set("forceHidden", true);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(sensorCommunity);



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
          L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
            .bindTooltip(sensorCommunityTootip, { direction: 'center' })
            .bindPopup(sensorCommunityPopup, {
              maxWidth: 4000
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


                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root1.setThemes([
                    am5themes_Animated.new(root1)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer1.grid.template.setAll({
                    stroke: root1.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  // axisRenderer1.ticks.template.setAll({
                  //   visible: true,
                  //   strokeOpacity: 0.5
                  // });

                  var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer1
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem1 = xAxis1.makeDataItem({});

                  var clockHand1 = am5radar.ClockHand.new(root1, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                    sprite: clockHand1
                  }));

                  xAxis1.createAxisRange(axisDataItem1);

                  var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem1.set("value", 0);
                  bullet1.get("sprite").on("rotation", function () {
                    var value1 = axisDataItem1.get("value");
                    var text1 = Math.round(axisDataItem1.get("value")).toString();
                    var fill1 = am5.color(0x000000);
                    xAxis1.axisRanges.each(function (axisRange) {
                      if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                        fill1 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0] != undefined) {

                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv1").style.opacity = 0.2;
                    document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                  }

                  // opacity: 0.6; /* Real browsers */
                  // filter: alpha(opacity = 60); /* MSIE */




                  chart1.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData1 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 10
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 11,
                    highScore: 20
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 21,
                    highScore: 25
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 26,
                    highScore: 50
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 51,
                    highScore: 75
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 76,
                    highScore: 100
                  }
                  ];



                  am5.array.each(bandsData1, function (data) {
                    var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                    axisRange1.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange1.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange1.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root1.interfaceColors.get("background")
                    });
                  });

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "PM1",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart1.appear(1000, 100);


                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root2.setThemes([
                    am5themes_Animated.new(root2)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart2 = root2.container.children.push(am5radar.RadarChart.new(root2, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer2 = am5radar.AxisRendererCircular.new(root2, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer2.grid.template.setAll({
                    stroke: root2.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  var xAxis2 = chart2.xAxes.push(am5xy.ValueAxis.new(root2, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer2
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem2 = xAxis2.makeDataItem({});

                  var clockHand2 = am5radar.ClockHand.new(root2, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet2 = axisDataItem2.set("bullet", am5xy.AxisBullet.new(root2, {
                    sprite: clockHand2
                  }));

                  xAxis2.createAxisRange(axisDataItem2);

                  var label2 = chart2.radarContainer.children.push(am5.Label.new(root2, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem2.set("value", 0);
                  bullet2.get("sprite").on("rotation", function () {
                    var value2 = axisDataItem2.get("value");
                    var text2 = Math.round(axisDataItem2.get("value")).toString();
                    var fill2 = am5.color(0x000000);
                    xAxis2.axisRanges.each(function (axisRange) {
                      if (value2 >= axisRange.get("value") && value2 <= axisRange.get("endValue")) {
                        fill2 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    label2.set("text", Math.round(value2).toString());

                    clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  setTimeout(function () {
                    axisDataItem2.animate({
                      key: "value",
                      to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)

                  chart2.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData2 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 10
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 11,
                    highScore: 20
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 21,
                    highScore: 25
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 26,
                    highScore: 50
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 51,
                    highScore: 75
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 76,
                    highScore: 100
                  }
                  ];



                  am5.array.each(bandsData2, function (data) {
                    var axisRange2 = xAxis2.createAxisRange(xAxis2.makeDataItem({}));

                    axisRange2.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange2.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange2.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root2.interfaceColors.get("background")
                    });
                  });

                  chart2.children.unshift(am5.Label.new(root2, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart2.children.unshift(am5.Label.new(root2, {
                    text: "PM2.5",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart2.appear(1000, 100);

                  // // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root3.setThemes([
                    am5themes_Animated.new(root3)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart3 = root3.container.children.push(am5radar.RadarChart.new(root3, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  //                   // Create axis and its renderer
                  //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer3 = am5radar.AxisRendererCircular.new(root3, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer3.grid.template.setAll({
                    stroke: root3.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });


                  var xAxis3 = chart3.xAxes.push(am5xy.ValueAxis.new(root3, {
                    maxDeviation: 0,
                    min: 0,
                    max: 200,
                    strictMinMax: true,
                    renderer: axisRenderer3
                  }));


                  //                   // Add clock hand
                  //                   // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem3 = xAxis3.makeDataItem({});

                  var clockHand3 = am5radar.ClockHand.new(root3, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet3 = axisDataItem3.set("bullet", am5xy.AxisBullet.new(root3, {
                    sprite: clockHand3
                  }));

                  xAxis3.createAxisRange(axisDataItem3);

                  var label3 = chart3.radarContainer.children.push(am5.Label.new(root3, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem3.set("value", 0);
                  bullet3.get("sprite").on("rotation", function () {
                    var value3 = axisDataItem3.get("value");
                    var text3 = Math.round(axisDataItem3.get("value")).toString();
                    var fill3 = am5.color(0x000000);
                    xAxis3.axisRanges.each(function (axisRange) {
                      if (value3 >= axisRange.get("value") && value3 <= axisRange.get("endValue")) {
                        fill3 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    label3.set("text", Math.round(value3).toString());

                    clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  setTimeout(function () {
                    axisDataItem3.animate({
                      key: "value",
                      to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)

                  chart3.bulletsContainer.set("mask", undefined);


                  // Create axis ranges bands
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                  var bandsData3 = [{
                    // title: "Bon",
                    color: "#4FF0E6",
                    lowScore: 0,
                    highScore: 20
                  }, {
                    // title: "Moyen",
                    color: "#51CCAA",
                    lowScore: 21,
                    highScore: 40
                  }, {
                    // title: "Dégradé",
                    color: "#EDE663",
                    lowScore: 41,
                    highScore: 50
                  }, {
                    // title: "Mauvais",
                    color: "#ED5E58",
                    lowScore: 51,
                    highScore: 100
                  }, {
                    // title: "Très mauvais",
                    color: "#881B33",
                    lowScore: 101,
                    highScore: 150
                  }, {
                    // title: "Extr. mauvais",
                    color: "#74287D",
                    lowScore: 151,
                    highScore: 200
                  }
                  ];



                  am5.array.each(bandsData3, function (data) {
                    var axisRange3 = xAxis3.createAxisRange(xAxis3.makeDataItem({}));

                    axisRange3.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange3.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    axisRange3.get("label").setAll({
                      text: data.title,
                      inside: true,
                      radius: 15,
                      fontSize: "0.9em",
                      fill: root3.interfaceColors.get("background")
                    });
                  });


                  chart3.children.unshift(am5.Label.new(root3, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  chart3.children.unshift(am5.Label.new(root3, {
                    text: "PM10",
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));
                  //                   // Make stuff animate on load
                  chart3.appear(1000, 100);

                  xAxis1.get("renderer").grid.template.set("forceHidden", true);
                  xAxis2.get("renderer").grid.template.set("forceHidden", true);
                  xAxis3.get("renderer").grid.template.set("forceHidden", true);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(sensorCommunity).setZIndexOffset(-1000);;
        } else {

          // L.marker([item['location']['latitude'], item['location']['longitude']], { icon: myIcon })
          L.marker([item['location']['latitude'], item['location']['longitude']], { icon: sc_icon })
            .on('click', function () {

              modalCreator("sensorcommunity", item['sensor']['id'], timeDateCounter(item.timestamp), -1);

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

                  // Set themes
                  // https://www.amcharts.com/docs/v5/concepts/themes/
                  root1.setThemes([
                    am5themes_Animated.new(root1)
                  ]);


                  // Create chart
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/
                  var chart1 = root1.container.children.push(am5radar.RadarChart.new(root1, {
                    panX: false,
                    panY: false,
                    startAngle: 160,
                    endAngle: 380
                  }));


                  // Create axis and its renderer
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
                  var axisRenderer1 = am5radar.AxisRendererCircular.new(root1, {
                    innerRadius: -20,
                    minGridDistance: 20
                  });

                  axisRenderer1.grid.template.setAll({
                    stroke: root1.interfaceColors.get("background"),
                    visible: false,
                    strokeOpacity: 0.8
                  });

                  // axisRenderer1.ticks.template.setAll({
                  //   visible: true,
                  //   strokeOpacity: 0.5
                  // });

                  var xAxis1 = chart1.xAxes.push(am5xy.ValueAxis.new(root1, {
                    maxDeviation: 0,
                    min: 0,
                    max: 100,
                    strictMinMax: true,
                    renderer: axisRenderer1
                  }));


                  // Add clock hand
                  // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
                  var axisDataItem1 = xAxis1.makeDataItem({});

                  var clockHand1 = am5radar.ClockHand.new(root1, {
                    pinRadius: am5.percent(20),
                    radius: am5.percent(35),
                    bottomWidth: 20
                  })

                  var bullet1 = axisDataItem1.set("bullet", am5xy.AxisBullet.new(root1, {
                    sprite: clockHand1
                  }));

                  xAxis1.createAxisRange(axisDataItem1);

                  var label1 = chart1.radarContainer.children.push(am5.Label.new(root1, {
                    fill: am5.color(0xffffff),
                    centerX: am5.percent(50),
                    textAlign: "center",
                    centerY: am5.percent(50),
                    fontSize: "1em"
                  }));

                  axisDataItem1.set("value", 0);
                  bullet1.get("sprite").on("rotation", function () {
                    var value1 = axisDataItem1.get("value");
                    var text1 = Math.round(axisDataItem1.get("value")).toString();
                    var fill1 = am5.color(0x000000);
                    xAxis1.axisRanges.each(function (axisRange) {
                      if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                        fill1 = axisRange.get("axisFill").get("fill");
                      }
                    })

                    try {
                      console.log(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]);
                    } catch (error) {
                      console.log("NO PM1");
                    }

                    console.log(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]);
                    console.log(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]);
                    console.log(compoundUpper == "PM1" && item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined);


                    if (compoundUpper == "PM1") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }


                    if (compoundUpper == "PM25") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }
                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (compoundUpper == "PM1") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P0")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

                  if (compoundUpper == "PM25") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P2")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

                  if (compoundUpper == "PM10") {
                    if (item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"] != undefined) {

                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(item["sensordatavalues"].filter((e) => e.value_type == "P1")[0]["value"]),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }
                  // opacity: 0.6; /* Real browsers */
                  // filter: alpha(opacity = 60); /* MSIE */

                  chart1.bulletsContainer.set("mask", undefined);


                  if (compoundUpper == "PM1" || compoundUpper == "PM25") {
                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 10
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 11,
                      highScore: 20
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 21,
                      highScore: 25
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 26,
                      highScore: 50
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 51,
                      highScore: 75
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 76,
                      highScore: 100
                    }
                    ];
                  }

                  if (compoundUpper == "PM10") {
                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      // title: "Bon",
                      color: "#4FF0E6",
                      lowScore: 0,
                      highScore: 20
                    }, {
                      // title: "Moyen",
                      color: "#51CCAA",
                      lowScore: 21,
                      highScore: 40
                    }, {
                      // title: "Dégradé",
                      color: "#EDE663",
                      lowScore: 41,
                      highScore: 50
                    }, {
                      // title: "Mauvais",
                      color: "#ED5E58",
                      lowScore: 51,
                      highScore: 100
                    }, {
                      // title: "Très mauvais",
                      color: "#881B33",
                      lowScore: 101,
                      highScore: 150
                    }, {
                      // title: "Extr. mauvais",
                      color: "#74287D",
                      lowScore: 151,
                      highScore: 200
                    }
                    ];
                  }



                  am5.array.each(bandsData1, function (data) {
                    var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));

                    axisRange1.setAll({
                      value: data.lowScore,
                      endValue: data.highScore
                    });

                    axisRange1.get("axisFill").setAll({
                      visible: true,
                      fill: am5.color(data.color),
                      fillOpacity: 1
                    });

                    // axisRange1.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
                  });

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: "µg/m³",
                    fontSize: 10,
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 15,
                  }));

                  switch (compoundUpper) {
                    case "PM1":
                      var gaugeText = "PM1";
                      break;
                    case "PM25":
                      var gaugeText = "PM2.5";
                      break;
                    case "PM10":
                      var gaugeText = "PM10";
                      break;
                  }

                  chart1.children.unshift(am5.Label.new(root1, {
                    text: gaugeText,
                    fontSize: 15,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                  }));

                  // Make stuff animate on load
                  chart1.appear(1000, 100);

                  xAxis1.get("renderer").grid.template.set("forceHidden", true);

                })
              }, 1000) // end am5.ready()

            })
            .addTo(sensorCommunity).setZIndexOffset(-1000);

        }
      }

    }

  });
}

function switchSensorCommunity() {
  if (
    timespanLower != 15 &&
    timespanLower != 60 &&
    timespanLower != 1440
  ) {
    if (document.querySelector("#checkbox_sensor_community").checked) {
      if (
        apiFetchSensorCommunity.data.length == 0 ||
        (apiFetchSensorCommunity.data.length != 0 &&
          apiFetchSensorCommunity.timespan != timespanLower)
      ) {
        console.log("Reload Sensor.Community!");
        loadSensorCommunity();
      } else {
        if (
          apiFetchSensorCommunity.data.length == 0 ||
          (apiFetchSensorCommunity.data.length != 0 &&
            Date.now() - apiFetchSensorCommunity.timestamp >
              timespanLower * 60 * 1000)
        ) {
          console.log("Reload Sensor.Community!");
          loadSensorCommunity();
        }
      }
      map.addLayer(sensorCommunity);
    } else {
      map.removeLayer(sensorCommunity);
    }
  } else {
    openToast(
      "Pas de moyennes quart-horaire, horaire et journalière pour les capteurs Sensor.Community."
    );
    document.querySelector("#checkbox_sensor_community").checked = false;
  }
  setQueryString();
}

function chooseTimeSensorCommunity(sensor, hours) {
  document.getElementById("chartSensor").src =
    "https://api-rrd.madavi.de:3000/grafana/d-solo/000000004/single-sensor-view-for-map?orgId=1&var-node=" +
    sensor +
    "&panelId=2";
  if (hours == 24) {
    document
      .getElementById("button24h")
      .classList.replace("btn-outline-secondary", "btn-secondary");
  }

  //A COMPLETER
}
