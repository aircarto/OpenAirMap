//on va chercher les coordonnées des NebuleAir 
function loadNebuleAir() {
    console.log("%cNebuleAir", "color: yellow; font-style: bold; background-color: blue;padding: 2px",);
    const start = Date.now();

    $.ajax({
        method: "GET",
        url: "../php_scripts/NebuleAir.php",
        data: ({timespan: timespanLower}),
    }).done(function (data) {

        closeToast_loading();

        const end = Date.now();
        const requestTimer = (end - start)/1000;

        console.log(`Data gathered in %c${requestTimer} sec`, "color: red;");
        console.log(data);

        apiFetchNebuleAir.data = data;
        apiFetchNebuleAir.timestamp = end;
        apiFetchNebuleAir.timespan = timespanLower;

        $.each(data, function (key, value) {

            var value_compound = Math.round(value[compoundUpper]);

            var nebuleAirPopup = '<img src="img/LogoNebuleAir.png" alt="" class="card-img-top">' +
            '<div id="gauges">'+
            '<div id="chartdiv1"></div>'+
            '<div id="chartdiv2"></div>'+
            '<div id="chartdiv3"></div>'+
            '</div>' +
            '<br>Capteur qualité de l\'air extérieur (' + value['sensorId'] + ') <br>' +
            '<br><button class="btn btn-primary" onclick="OpenSidePanel(\'' + value['sensorId'] + '\')">Voir les données</button>'

            
            //image des points sur la carte
            var icon_param = {
                iconUrl: 'img/nebuleAir/nebuleAir_default.png',
                iconSize: [80, 80], // size of the icon
                iconAnchor: [5, 70], // point of the icon which will correspond to marker's location
                //popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor
            }

            //change icon color for PM1 and PM25

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
            if(value_compound != -1){
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + value_compound + '</div>',
                iconAnchor: [x_position, y_position],
                popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

            });
          }else{

            var myIcon = L.divIcon({
              className: 'my-div-icon',
              html: '<div id="textDiv" style="font-size: ' + textSize + 'px;">' + '*' + '</div>',
              iconAnchor: [x_position, y_position],
              popupAnchor: [30, -60] // point from which the popup should open relative to the iconAnchor

          });
        }

            //on ajoute un point (marker) pour chaque sensor qui ouvre un popup lorsque l'on clique dessus
            L.marker([value['latitude'], value['longitude']], { icon: nebuleAir_icon })
                // .addTo(map)
                .addTo(nebuleairParticuliers)

            //on ajoute le texte sur les points
            L.marker([value['latitude'], value['longitude']], { icon: myIcon })
                // .addTo(map)
                .bindPopup(nebuleAirPopup, {
                    maxWidth: 4000
                })
                .on('click', function(){


                     am5.ready(function() {

                    // Create root element
                    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                    var root1 = am5.Root.new("chartdiv1");
                    var root2 = am5.Root.new("chartdiv2");
                    var root3 = am5.Root.new("chartdiv3");
                    
                    
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
                      innerRadius: -40
                    });
                    
                    axisRenderer1.grid.template.setAll({
                      stroke: root1.interfaceColors.get("background"),
                      visible: true,
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
                      radius: am5.percent(100),
                      bottomWidth: 40
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
                      fontSize: "3em"
                    }));
                    
                    axisDataItem1.set("value", 0);
                    bullet1.get("sprite").on("rotation", function () {
                      var value1 = axisDataItem1.get("value");
                      var text = Math.round(axisDataItem1.get("value")).toString();
                      var fill = am5.color(0x000000);
                      xAxis1.axisRanges.each(function (axisRange) {
                        if (value1 >= axisRange.get("value") && value1 <= axisRange.get("endValue")) {
                          fill = axisRange.get("axisFill").get("fill");
                        }
                      })
                    
                      label1.set("text", Math.round(value1).toString());
                    
                      clockHand1.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                      clockHand1.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
                    });
                    
                    setTimeout(function () {
                      axisDataItem1.animate({
                        key: "value",
                        to: value_compound,
                        duration: 500,
                        easing: am5.ease.out(am5.ease.cubic)
                      });
                    }, 1000)
                    
                    chart1.bulletsContainer.set("mask", undefined);
                    
                    
                    // Create axis ranges bands
                    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
                    var bandsData1 = [{
                      title: "Unsustainable",
                      color: "#ee1f25",
                      lowScore: -40,
                      highScore: -20
                    }, {
                      title: "Volatile",
                      color: "#f04922",
                      lowScore: -20,
                      highScore: 0
                    }, {
                      title: "Foundational",
                      color: "#fdae19",
                      lowScore: 0,
                      highScore: 20
                    }, {
                      title: "Developing",
                      color: "#f3eb0c",
                      lowScore: 20,
                      highScore: 40
                    }, {
                      title: "Maturing",
                      color: "#b0d136",
                      lowScore: 40,
                      highScore: 60
                    }, {
                      title: "Sustainable",
                      color: "#54b947",
                      lowScore: 60,
                      highScore: 80
                    }, {
                      title: "High Performing",
                      color: "#0f9747",
                      lowScore: 80,
                      highScore: 100
                    }];
                    
                    am5.array.each(bandsData1, function (data) {
                      var axisRange1 = xAxis1.createAxisRange(xAxis1.makeDataItem({}));
                    
                      axisRange1.setAll({
                        value: data.lowScore,
                        endValue: data.highScore
                      });
                    
                      axisRange1.get("axisFill").setAll({
                        visible: true,
                        fill: am5.color(data.color),
                        fillOpacity: 0.8
                      });
                    
                      axisRange1.get("label").setAll({
                        text: data.title,
                        inside: true,
                        radius: 15,
                        fontSize: "0.9em",
                        fill: root1.interfaceColors.get("background")
                      });
                    });
                    
                    
                    // Make stuff animate on load
                    chart1.appear(1000, 100);
                    
                    }); // end am5.ready()

                })
                .addTo(nebuleairParticuliers);
              
        });

    })
    .fail(function(){
        console.log("Error while geting data from AirCarto API");
    });
};