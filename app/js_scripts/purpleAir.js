function loadPurpleAir() {
  console.log("%cPurpleAir", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const start = Date.now();
  purpleAir.clearLayers();

  if (timespanLower != 2 && compoundUpper != "PM25") {
    openToast("PurpleAir ne propose pas de moyennes quart-horaires, horaires et journalières pour les PM1 et les PM10");
  }

  $.ajax({
    method: "GET",
    url: "../php_scripts/PurpleAir.php",
    data: ({ timespan: timespanLower }),
    //data: ({timespan: timespanLower, key: PURPLEAIR_API_KEY}),
  }).done(function (data) {
    console.log(data.data);
    const end = Date.now();
    const requestTimer = (end - start) / 1000;

    console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");

    apiFetchPurpleAir.data = data.data;
    apiFetchPurpleAir.timestamp = end;
    apiFetchPurpleAir.timespan = timespanLower;

    $.each(data.data, function (key, value) {

      var sensorid = value[0];
      var last_seen = value[1];
      var location = value[2];
      var lat = value[3];
      var long = value[4]

      if (timespanLower == 2) {
        var pm1_value = value[5];
        var pm25_value = value[6];
        var pm10_value = value[7];
      } else {
        pm1_value == -1.0;
        pm25_value = value[5];
        pm10_value == -1.0;
      }

      var purpleAirPopup = '<img src="img/LogoPurpleAir.png" alt="" class="card-img-top">' +
        '<div id="gauges">' +
        '<div id="chartdiv1"></div>' +
        '<div id="chartdiv2"></div>' +
        '<div id="chartdiv3"></div>' +
        '</div>' +
        '<div class="text-center" style="padding-top:15px">' +
        '<br>Dernière mesure effectuée :' + timeDateCounter(last_seen * 1000) + '<br>' +
        '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">purpleair-' + sensorid + '</button>' +
        '<button class="btn btn-primary" onclick="OpenSidePanel(\'purpleair-' + sensorid + '\')" disabled>Voir les données</button>' +
        '</div>';

      var purpleAirTootip = sensorid.toString();

      var icon_param = {
        iconUrl: 'img/purpleAir/purpleAir_default.png',
        iconSize: [80, 80], // size of the icon
        iconAnchor: [0, 60], // point of the icon which will correspond to marker's location
        //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
      }



      switch (compoundUpper) {
        case 'PM1':
          var value_compound = Math.round(pm1_value);
          break;
        case 'PM25':
          var value_compound = Math.round(pm25_value);
          break;
        case 'PM10':
          var value_compound = Math.round(pm10_value);
          break;
      }



      //BON
      if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_bon.png';
      }
      //MOYEN
      if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_tresmauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_extmauvais.png';
      }


      //change icon color for PM10
      //BON
      if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_bon.png';
      }
      //MOYEN
      if (value_compound >= 20 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_moyen.png';
      }
      //DEGRADE
      if (value_compound >= 40 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_degrade.png';
      }
      //MAUVAIS
      if (value_compound >= 50 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_mauvais.png';
      }
      //TRES MAUVAIS
      if (value_compound >= 100 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_tresmauvais.png';
      }
      //extr MAUVAIS
      if (value_compound >= 150 && compoundUpper == "PM10") {
        icon_param.iconUrl = 'img/purpleAir/purpleAir_extmauvais.png';
      }

      //add icon to map
      var purpleAir_icon = L.icon(icon_param);

      //textSize
      var textSize = 45;
      var x_position = -18;
      var y_position = 54;

      //smaller text size if number is greater than 9
      if (value_compound >= 10) {
        textSize = 38;
        x_position = -8;
        y_position = 49;
      }

      if (!isNaN(value_compound)) {
        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
        });

        L.marker([lat, long], { icon: purpleAir_icon })
          .addTo(purpleAir);

        if (!isMobile) {

          L.marker([lat, long], { icon: myIcon })
            .bindTooltip(purpleAirTootip, { direction: 'center' })
            .bindPopup(purpleAirPopup, {
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

                    if (!isNaN(pm1_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm1_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm1_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv1").style.opacity = 0.2;
                    document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                  }

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
                    strokeOpacity: 0.8,
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

                    if (!isNaN(pm25_value)) {
                      label2.set("text", Math.round(value2).toString());
                    } else {
                      label2.set("text", "N/A");
                    }
                    clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm25_value)) {
                    setTimeout(function () {
                      axisDataItem2.animate({
                        key: "value",
                        to: Math.round(pm25_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv2").style.opacity = 0.2;
                    document.querySelector("#chartdiv2").style.filter = "alpha(opacity = 20)";
                  }


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

                    // axisRange2.get("grid").setAll({
                    //   stroke: am5.color(data.color),
                    //   strokeOpacity: 1
                    // });

                    // axisRange2.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
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
                    strokeOpacity: 0.8,
                  });


                  // yAxis.get("renderer").grid.template.set("forceHidden", true);


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

                    if (!isNaN(pm10_value)) {
                      label3.set("text", Math.round(value3).toString());
                    } else {
                      label3.set("text", "N/A");
                    }

                    clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm10_value)) {
                    setTimeout(function () {
                      axisDataItem3.animate({
                        key: "value",
                        to: Math.round(pm10_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv3").style.opacity = 0.2;
                    document.querySelector("#chartdiv3").style.filter = "alpha(opacity = 20)";
                  }



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

                    // axisRange3.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
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
            .addTo(purpleAir);
        } else {
          L.marker([lat, long], { icon: myIcon })
            .on('click', function () {

              modalCreator("purpleair", sensorid.toString(), timeDateCounter(last_seen * 1000), -1);

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

                    if (compoundUpper == "PM1") {
                      if (!isNaN(pm1_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM25") {
                      if (!isNaN(pm25_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (!isNaN(pm10_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (compoundUpper == "PM1") {
                    if (!isNaN(pm1_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm1_value),
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
                    if (!isNaN(pm25_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm25_value),
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
                    if (!isNaN(pm10_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm10_value),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

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


                })
              }, 1000)


            })
            .addTo(purpleAir);
        }
      } else {

        var myIcon = L.divIcon({
          className: 'my-div-icon',
          html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
          iconAnchor: [x_position, y_position],
          popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
        });

        if (!isMobile) {
          L.marker([lat, long], { icon: purpleAir_icon })
            .bindTooltip(purpleAirTootip, { direction: 'center' })
            .bindPopup(purpleAirPopup, {
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


                    if (!isNaN(pm1_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm1_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm1_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv1").style.opacity = 0.2;
                    document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                  }

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
                    strokeOpacity: 0.8,
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

                    if (!isNaN(pm25_value)) {
                      label2.set("text", Math.round(value2).toString());
                    } else {
                      label2.set("text", "N/A");
                    }
                    clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm25_value)) {
                    setTimeout(function () {
                      axisDataItem2.animate({
                        key: "value",
                        to: Math.round(pm25_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv2").style.opacity = 0.2;
                    document.querySelector("#chartdiv2").style.filter = "alpha(opacity = 20)";
                  }


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

                    // axisRange2.get("grid").setAll({
                    //   stroke: am5.color(data.color),
                    //   strokeOpacity: 1
                    // });

                    // axisRange2.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
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
                    strokeOpacity: 0.8,
                  });


                  // yAxis.get("renderer").grid.template.set("forceHidden", true);


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

                    if (!isNaN(pm10_value)) {
                      label3.set("text", Math.round(value3).toString());
                    } else {
                      label3.set("text", "N/A");
                    }

                    clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (!isNaN(pm10_value)) {
                    setTimeout(function () {
                      axisDataItem3.animate({
                        key: "value",
                        to: Math.round(pm10_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#chartdiv3").style.opacity = 0.2;
                    document.querySelector("#chartdiv3").style.filter = "alpha(opacity = 20)";
                  }


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

                    // axisRange3.get("label").setAll({
                    //   text: data.title,
                    //   inside: true,
                    //   radius: 15,
                    //   fontSize: "0.9em",
                    //   fill: root1.interfaceColors.get("background")
                    // });
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
            .addTo(purpleAir).setZIndexOffset(-1000);
        } else {

          L.marker([lat, long], { icon: purpleAir_icon })
            .on('click', function () {
              modalCreator("purpleair", sensorid.toString(), timeDateCounter(last_seen * 1000), -1);

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

                    if (compoundUpper == "PM1") {
                      if (!isNaN(pm1_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM25") {
                      if (!isNaN(pm25_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    if (compoundUpper == "PM10") {
                      if (!isNaN(pm10_value)) {
                        label1.set("text", Math.round(value1).toString());
                      } else {
                        label1.set("text", "N/A");
                      }
                    }

                    clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  });

                  if (compoundUpper == "PM1") {
                    if (!isNaN(pm1_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm1_value),
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
                    if (!isNaN(pm25_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm25_value),
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
                    if (!isNaN(pm10_value)) {
                      setTimeout(function () {
                        axisDataItem1.animate({
                          key: "value",
                          to: Math.round(pm10_value),
                          duration: 500,
                          easing: am5.ease.out(am5.ease.cubic)
                        });
                      }, 1000)
                    } else {
                      document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                      document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                    }
                  }

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


                })
              }, 1000)



            })
            .addTo(purpleAir).setZIndexOffset(-1000);
        }
      }
    })
  })
    .fail(function () {
      console.log("Error while geting data from PurpleAir API");
    })
}

function changePurpleAir() {

  if (timespanLower != 2 && compoundUpper != "PM25") {
    openToast("PurpleAir ne propose pas de moyennes quart-horaires, horaires et journalières pour les PM1 et les PM10");
  }

  $.each(apiFetchPurpleAir.data, function (key, value) {

    var sensorid = value[0];
    var last_seen = value[1];
    var location = value[2];
    var lat = value[3];
    var long = value[4]

    if (timespanLower == 2) {
      var pm1_value = value[5];
      var pm25_value = value[6];
      var pm10_value = value[7];
    } else {
      pm1_value == -1.0;
      pm25_value = value[5];
      pm10_value == -1.0;
    }


    var purpleAirPopup = '<img src="img/LogoPurpleAir.png" alt="" class="card-img-top">' +
      '<div id="gauges">' +
      '<div id="chartdiv1"></div>' +
      '<div id="chartdiv2"></div>' +
      '<div id="chartdiv3"></div>' +
      '</div>' +
      '<div class="text-center" style="padding-top:15px">' +
      '<br>Dernière mesure effectuée :' + timeDateCounter(last_seen * 1000) + '<br>' +
      '<br><button class="btn btn-outline-primary disabled" style="margin-right:5px;">purpleair-' + sensorid + '</button>' +
      '<button class="btn btn-primary" onclick="OpenSidePanel(\'purpleair-' + sensorid + '\')" disabled>Voir les données</button>' +
      '</div>';

    var purpleAirTootip = sensorid.toString();

    var icon_param = {
      iconUrl: 'img/purpleAir/purpleAir_default.png',
      iconSize: [80, 80], // size of the icon
      iconAnchor: [0, 60], // point of the icon which will correspond to marker's location
      //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
    }



    switch (compoundUpper) {
      case 'PM1':
        var value_compound = Math.round(pm1_value);
        break;
      case 'PM25':
        var value_compound = Math.round(pm25_value);
        break;
      case 'PM10':
        var value_compound = Math.round(pm10_value);
        break;
    }


    //BON
    if (value_compound >= 0 && value_compound < 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_bon.png';
    }
    //MOYEN
    if (value_compound >= 10 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_moyen.png';
    }
    //DEGRADE
    if (value_compound >= 20 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_degrade.png';
    }
    //MAUVAIS
    if (value_compound >= 25 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_mauvais.png';
    }
    //TRES MAUVAIS
    if (value_compound >= 50 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_tresmauvais.png';
    }
    //extr MAUVAIS
    if (value_compound >= 75 && (compoundUpper == "PM1" || compoundUpper == "PM25")) {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_extmauvais.png';
    }


    //change icon color for PM10
    //BON
    if (value_compound >= 0 && value_compound < 20 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_bon.png';
    }
    //MOYEN
    if (value_compound >= 20 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_moyen.png';
    }
    //DEGRADE
    if (value_compound >= 40 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_degrade.png';
    }
    //MAUVAIS
    if (value_compound >= 50 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_mauvais.png';
    }
    //TRES MAUVAIS
    if (value_compound >= 100 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_tresmauvais.png';
    }
    //extr MAUVAIS
    if (value_compound >= 150 && compoundUpper == "PM10") {
      icon_param.iconUrl = 'img/purpleAir/purpleAir_extmauvais.png';
    }

    //add icon to map
    var purpleAir_icon = L.icon(icon_param);

    //textSize
    var textSize = 45;
    var x_position = -18;
    var y_position = 54;

    //smaller text size if number is greater than 9
    if (value_compound >= 10) {
      textSize = 38;
      x_position = -8;
      y_position = 49;
    }

    if (!isNaN(value_compound)) {
      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

      });
      L.marker([lat, long], { icon: purpleAir_icon })
        .addTo(purpleAir);

      if (!isMobile) {

        L.marker([lat, long], { icon: myIcon })
          .bindTooltip(purpleAirTootip, { direction: 'center' })
          .bindPopup(purpleAirPopup, {
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


                  if (!isNaN(pm1_value)) {
                    label1.set("text", Math.round(value1).toString());
                  } else {
                    label1.set("text", "N/A");
                  }

                  clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm1_value)) {
                  setTimeout(function () {
                    axisDataItem1.animate({
                      key: "value",
                      to: Math.round(pm1_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv1").style.opacity = 0.2;
                  document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                }

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
                  strokeOpacity: 0.8,
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

                  if (!isNaN(pm25_value)) {
                    label2.set("text", Math.round(value2).toString());
                  } else {
                    label2.set("text", "N/A");
                  }
                  clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm25_value)) {
                  setTimeout(function () {
                    axisDataItem2.animate({
                      key: "value",
                      to: Math.round(pm25_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv2").style.opacity = 0.2;
                  document.querySelector("#chartdiv2").style.filter = "alpha(opacity = 20)";
                }


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

                  // axisRange2.get("grid").setAll({
                  //   stroke: am5.color(data.color),
                  //   strokeOpacity: 1
                  // });

                  // axisRange2.get("label").setAll({
                  //   text: data.title,
                  //   inside: true,
                  //   radius: 15,
                  //   fontSize: "0.9em",
                  //   fill: root1.interfaceColors.get("background")
                  // });
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
                  strokeOpacity: 0.8,
                });


                // yAxis.get("renderer").grid.template.set("forceHidden", true);


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

                  if (!isNaN(pm10_value)) {
                    label3.set("text", Math.round(value3).toString());
                  } else {
                    label3.set("text", "N/A");
                  }

                  clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm10_value)) {
                  setTimeout(function () {
                    axisDataItem3.animate({
                      key: "value",
                      to: Math.round(pm10_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv3").style.opacity = 0.2;
                  document.querySelector("#chartdiv3").style.filter = "alpha(opacity = 20)";
                }



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

                  // axisRange3.get("label").setAll({
                  //   text: data.title,
                  //   inside: true,
                  //   radius: 15,
                  //   fontSize: "0.9em",
                  //   fill: root1.interfaceColors.get("background")
                  // });
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
          .addTo(purpleAir);
      } else {
        L.marker([lat, long], { icon: myIcon })
          .on('click', function () {
            console.log("ON CLICK");
            modalCreator("purpleair", sensorid.toString(), timeDateCounter(last_seen * 1000), -1);

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

                  if (compoundUpper == "PM1") {
                    if (!isNaN(pm1_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  if (compoundUpper == "PM25") {
                    if (!isNaN(pm25_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  if (compoundUpper == "PM10") {
                    if (!isNaN(pm10_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (compoundUpper == "PM1") {
                  if (!isNaN(pm1_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm1_value),
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
                  if (!isNaN(pm25_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm25_value),
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
                  if (!isNaN(pm10_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm10_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                    document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                  }
                }

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


              })
            }, 1000)



          })
          .addTo(purpleAir);

      }
    } else {

      var myIcon = L.divIcon({
        className: 'my-div-icon',
        html: '<div id="textDiv" style="font-size: ' + textSize + 'px;"></div>',
        iconAnchor: [x_position, y_position],
        popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
      });

      if (!isMobile) {
        L.marker([lat, long], { icon: purpleAir_icon })
          .bindTooltip(purpleAirTootip, { direction: 'center' })
          .bindPopup(purpleAirPopup, {
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


                  if (!isNaN(pm1_value)) {
                    label1.set("text", Math.round(value1).toString());
                  } else {
                    label1.set("text", "N/A");
                  }

                  clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm1_value)) {
                  setTimeout(function () {
                    axisDataItem1.animate({
                      key: "value",
                      to: Math.round(pm1_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv1").style.opacity = 0.2;
                  document.querySelector("#chartdiv1").style.filter = "alpha(opacity = 20)";
                }

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
                  strokeOpacity: 0.8,
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

                  if (!isNaN(pm25_value)) {
                    label2.set("text", Math.round(value2).toString());
                  } else {
                    label2.set("text", "N/A");
                  }
                  clockHand2.pin.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand2.hand.animate({ key: "fill", to: fill2, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm25_value)) {
                  setTimeout(function () {
                    axisDataItem2.animate({
                      key: "value",
                      to: Math.round(pm25_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv2").style.opacity = 0.2;
                  document.querySelector("#chartdiv2").style.filter = "alpha(opacity = 20)";
                }


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

                  // axisRange2.get("grid").setAll({
                  //   stroke: am5.color(data.color),
                  //   strokeOpacity: 1
                  // });

                  // axisRange2.get("label").setAll({
                  //   text: data.title,
                  //   inside: true,
                  //   radius: 15,
                  //   fontSize: "0.9em",
                  //   fill: root1.interfaceColors.get("background")
                  // });
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
                  strokeOpacity: 0.8,
                });


                // yAxis.get("renderer").grid.template.set("forceHidden", true);


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

                  if (!isNaN(pm10_value)) {
                    label3.set("text", Math.round(value3).toString());
                  } else {
                    label3.set("text", "N/A");
                  }

                  clockHand3.pin.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand3.hand.animate({ key: "fill", to: fill3, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (!isNaN(pm10_value)) {
                  setTimeout(function () {
                    axisDataItem3.animate({
                      key: "value",
                      to: Math.round(pm10_value),
                      duration: 500,
                      easing: am5.ease.out(am5.ease.cubic)
                    });
                  }, 1000)
                } else {
                  document.querySelector("#chartdiv3").style.opacity = 0.2;
                  document.querySelector("#chartdiv3").style.filter = "alpha(opacity = 20)";
                }



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

                  // axisRange3.get("label").setAll({
                  //   text: data.title,
                  //   inside: true,
                  //   radius: 15,
                  //   fontSize: "0.9em",
                  //   fill: root1.interfaceColors.get("background")
                  // });
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
          .addTo(purpleAir).setZIndexOffset(-1000);
      } else {

        L.marker([lat, long], { icon: purpleAir_icon })
          .on('click', function () {
            console.log("ON CLICK");
            modalCreator("purpleair", sensorid.toString(), timeDateCounter(last_seen * 1000), -1);

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

                  if (compoundUpper == "PM1") {
                    if (!isNaN(pm1_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  if (compoundUpper == "PM25") {
                    if (!isNaN(pm25_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  if (compoundUpper == "PM10") {
                    if (!isNaN(pm10_value)) {
                      label1.set("text", Math.round(value1).toString());
                    } else {
                      label1.set("text", "N/A");
                    }
                  }

                  clockHand1.pin.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                  clockHand1.hand.animate({ key: "fill", to: fill1, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                });

                if (compoundUpper == "PM1") {
                  if (!isNaN(pm1_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm1_value),
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
                  if (!isNaN(pm25_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm25_value),
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
                  if (!isNaN(pm10_value)) {
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: Math.round(pm10_value),
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                  } else {
                    document.querySelector("#modal_chartdivmodalgauge").style.opacity = 0.2;
                    document.querySelector("#modal_chartdivmodalgauge").style.filter = "alpha(opacity = 20)";
                  }
                }

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


              })
            }, 1000)



          })
          .addTo(purpleAir).setZIndexOffset(-1000);

      }
    }
  })

}

function load1PurpleAir(id, hours, timespan) {

  console.log("%cPurpleAir 1 sensor", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
  const end = new Date();
  const end_string = end.toISOString();
  const get_start = end.setHours(end.getHours() - hours);
  const start = new Date(get_start);
  const start_string = start.toISOString()
  console.log(start_string);
  console.log(end_string);

  console.log(id);

  let chartTitleText = "";
  chartTitleText += "PurpleAir-" + id + ", ";

  switch (timespan) {
    case 2:
      chartTitleText += "mesures à 2 minutes, ";
      break;
    case 15:
      chartTitleText += "moyennes quart-horaires, ";
      break;
    case 60:
      chartTitleText += "moyennes horaires, ";
      break;
    case 1440:
      chartTitleText += "moyennes journalières, ";
      break;
  }

  chartTitleText += "µg/m3";

  $.ajax({
    method: "GET",
    url: "../php_scripts/PurpleAir_1sensor.php",
    data: ({
      id: id,
      debut: start_string,
      fin: end_string,
      timespan: timespan,
      key: PURPLEAIR_API_KEY
    }),
  }).done(function (data) {
    console.log(data);
  })
    .fail(function () {
      console.log("Error while geting data from Aircarto API");
    });
}

function switchPurpleAir() {
  if (document.querySelector("#checkbox_purpleAir").checked) {
    if (
      apiFetchPurpleAir.data.length == 0 ||
      (apiFetchPurpleAir.data.length != 0 &&
        apiFetchPurpleAir.timespan != timespanLower)
    ) {
      console.log("Reload PurpleAir!");
      loadPurpleAir();
    } else {
      if (
        apiFetchPurpleAir.data.length == 0 ||
        (apiFetchPurpleAir.data.length != 0 &&
          Date.now() - apiFetchPurpleAir.timestamp >
            timespanLower * 60 * 1000)
      ) {
        console.log("Reload PurpleAir!");
        loadPurpleAir();
      }
    }
    map.addLayer(purpleAir);
  } else {
    map.removeLayer(purpleAir);
  }
  setQueryString();
}

//Because of the close API, es gibt für PurpleAir kein graphics


