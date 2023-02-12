// import leaflet
import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import * as L from 'leaflet';

// d3 libraries
import * as d3_Hexbin from "d3-hexbin";
import * as d3_Selection from 'd3-selection';
import * as d3_Transition from "d3-transition";
import {scaleLinear} from 'd3-scale';
import {geoPath, geoTransform} from 'd3-geo';
import {timeMinute} from 'd3-time';
import {timeFormatLocale, timeParse, timeFormat} from 'd3-time-format';
import {median} from 'd3-array';
import {interpolateRgb} from 'd3-interpolate';

import 'whatwg-fetch';

const d3 = Object.assign({}, d3_Selection, d3_Hexbin);

import api from './feinstaub-api';
import api2 from './feinstaub-api2';
import PACAdata from './pacadata.js';
import Nebulodata from './aircartodata.js';
import * as config from './config.js';

import '../images/labMarker.svg';
import '../css/style.css';
import '../css/leaflet.css';

// copy favicons
import '../favicons/android-chrome-192x192.png';
import '../favicons/android-chrome-512x512.png';
import '../favicons/apple-touch-icon.png';
import '../favicons/favicon-16x16.png';
import '../favicons/favicon-32x32.png';
import '../favicons/favicon.ico';
import '../favicons/mstile-150x150.png';
import '../favicons/safari-pinned-tab.svg';
import '../favicons/site.webmanifest';
import '../favicons/browserconfig.xml';

let hexagonheatmap, hmhexaPM_aktuell, hmhexaPM_AQI, hmhexa_t_h_p, hmhexa_noise, hmhexaPM_WHO, hmhexaPM_EU;


let SC_PM = {"type": "FeatureCollection","name": "SCSensors","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []};

let NebuloData = {"type": "FeatureCollection","name": "Nebulo","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []};

let AtmoPACAData ={PM10:{"type": "FeatureCollection","name": "stations_AtmoSud_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoSud_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

let AtmoPACADataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

// let AtmoPurpleData ={PM10:{"type": "FeatureCollection","name": "Purple_Air","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

// let AtmoPurpleDataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

const scale_options = {
	"PM10": {
		valueDomain: [-1,0, 20, 40, 60, 100, 500],
		colorRange: ['#808080','#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	},
	"PM25": {
		valueDomain: [-1,0, 10, 20, 40, 60, 100],
		colorRange: ['#808080','#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	},
    "PM1": {
		valueDomain: [-1,0, 10, 20, 40, 60, 100],
		colorRange: ['#808080','#00796B','#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	}
};

const locale = timeFormatLocale({
	"dateTime": "%Y.%m.%d %H:%M:%S",
	"date": "%d.%m.%Y",
	"time": "%H:%M:%S",
	"periods": ["AM", "PM"],
	"days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	"shortDays": ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
	"months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	"shortMonths": ["Jan.", "Feb.", "Mar.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."]
});

var timer0 = new Date

var logger = {
"sc":{"display":false,"data":"nodata","time":timer0},
"paca":{"display":false,"data":"nodata","time":timer0},
"purple":{"display":false,"data":"nodata","time":timer0}
};

let openedGraph1 = [];
let timestamp_data = '';			// needs to be global to work over all 4 data streams
let timestamp_from = '';			// needs to be global to work over all 4 data streams
let clicked = null;
let user_selected_value = config.sensor;
let coordsCenter = config.initialView;
let zoomLevel = config.initialZoom;
// const locale = timeFormatLocale(config.locale);
const map = L.map("map", {preferCanvas: true, zoomControl: false, controls: false}).setView(config.initialView, config.initialZoom);
map.attributionControl.setPosition('bottomleft')

config.tiles = config.tiles_server + config.tiles_path;
L.tileLayer(config.tiles, {
    maxZoom: config.maxZoom, minZoom: config.minZoom, subdomains: config.tiles_subdomains,
}).addTo(map);
// Adds query and hash parameter to the current URL
new L.Hash(map);

// iife function to read query parameter from URL
(function () {
    let query_value;
    const search_values = location.search.replace('\?', '').split('&');
    for (let i = 0; i < search_values.length; i++) {
        query_value = search_values[i].split('=');
        (typeof query_value[0] != 'sensor' && undefined) ? user_selected_value = query_value[1] : user_selected_value = config.sensor;
    }
})();




// // Intitialisation of the Leaflet Layers for each dataset

var AtmoPACAStationsMap = L.geoJSON(AtmoPACADataCurrent.PM25,{
    pointToLayer: function (feature, latlng) {
     return L.circleMarker(latlng, {
      radius:5,
      fillColor: colorScaler(user_selected_value,feature.properties.valeur),
      stroke:true,
      weight:2,
      stroke:true,
      color :'black',
      fillOpacity: 1})
    },
    onEachFeature: function (feature, layer) {
        
        if (feature.properties.valeur == -1){feature.properties.valeur = "N/A"};
        
      var popupContent = "<h2>AtmoSud</h2><p><b>Name</b> : "+feature.properties.nom_station+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.influence +")</p><button type='button' id='button" + feature.properties.code_station + "' value='" + feature.properties.code_station + "'>Show graph!</button><div id='graph"+ feature.properties.code_station +"'></div>";
      layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
    }


      }).addTo(map);


var SCSensorsMap = L.geoJSON(SC_PM,{
    pointToLayer: function (feature, latlng) {
     return L.circleMarker(latlng, {
      radius:5,
      fillColor: colorScaler(user_selected_value,feature.properties.data),
      stroke:true,
      weight:2,
      stroke:false,
      color :'blue',
      fillOpacity: 1})
    },
    onEachFeature: function (feature, layer) {
      var popupContent = "<h2>Sensor.Community</h2><p><b>Sensor ID</b> : "+feature.properties.id+"</p><p><b>PM10</b> : "+feature.properties.data.PM10+" µg\/m&sup3;</p><p><b>PM25</b> : "+feature.properties.data.PM25+" µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
      layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
    }}).addTo(map);


    var AirCartoSensorsMap = L.geoJSON(SC_PM,{
        pointToLayer: function (feature, latlng) {
         return L.circleMarker(latlng, {
          radius:5,
          fillColor: colorScaler(user_selected_value,feature.properties.data),
          stroke:true,
          weight:2,
          stroke:false,
          color :'red',
          fillOpacity: 1})
        },
        onEachFeature: function (feature, layer) {
          var popupContent = "<h2>Nebulo AirCarto</h2><p><b>Sensor ID</b> : "+feature.properties.id+"</p><p><b>PM10</b> : "+feature.properties.data.PM10+" µg\/m&sup3;</p><p><b>PM25</b> : "+feature.properties.data.PM25+" µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
          layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
        }}).addTo(map);
    

// var PurpleSensorsMap = L.geoJSON(SC_PM,{
//         pointToLayer: function (feature, latlng) {
//          return L.circleMarker(latlng, {
//           radius:5,
//           fillColor: colorScaler(user_selected_value,feature.properties.data),
//           stroke:true,
//           weight:2,
//           stroke:false,
//           color :'blue',
//           fillOpacity: 1})
//         },
//         onEachFeature: function (feature, layer) {
//           var popupContent = "<h2>PurpleAir</h2><p><b>Sensor ID</b> : "+feature.properties.id+"</p><p><b>PM10</b> : "+feature.properties.data.PM10+" µg\/m&sup3;</p><p><b>PM25</b> : "+feature.properties.data.PM25+" µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
//           layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
//         }}).addTo(map);

//         var AtmoPACAStationsMap = L.geoJSON(AtmoPACADataCurrent.PM25,{
//             pointToLayer: function (feature, latlng) {
//              return L.circleMarker(latlng, {
//               radius:5,
//               fillColor: colorScaler(user_selected_value,feature.properties.valeur),
//               stroke:true,
//               weight:2,
//               stroke:true,
//               color :'black',
//               fillOpacity: 1})
//             },
//             onEachFeature: function (feature, layer) {
                
//                 if (feature.properties.valeur == -1){feature.properties.valeur = "N/A"};
                
//               var popupContent = "<h2>AtmoSud</h2><p><b>Name</b> : "+feature.properties.nom_station+"</p><p><b>Value</b> : "+feature.properties.valeur+" µg\/m&sup3; ("+ feature.properties.influence +")</p><button type='button' id='button" + feature.properties.code_station + "' value='" + feature.properties.code_station + "'>Show graph!</button><div id='graph"+ feature.properties.code_station +"'></div>";
//               layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
//             }
        
        
//               }).addTo(map);



window.onload = function () {
    L.HexbinLayer = L.Layer.extend({
        _undef(a) {
            return typeof a === 'undefined';
        }, options: {
            radius: 25, opacity: 0.6, duration: 200, attribution: config.attribution, click: function (d) {
                setTimeout(function () {
                    if (clicked === null) sensorNr(d);
                    clicked += 1;
                }, 500)
            },

            lng: function (d) {
                return d.longitude;
            }, lat: function (d) {
                return d.latitude;
            }, value: function (d) {
                return data_median(d);
            },
        },

        initialize(options) {
            L.setOptions(this, options);
            this._data = [];
            this._colorScale = scaleLinear()
                .domain(this.options.valueDomain)
                .range(this.options.colorRange)
                .clamp(true);
        },

        // Make hex radius dynamic for different zoom levels to give a nicer overview of the sensors as well as making sure that the hex grid does not cover the whole world when zooming out
        getFlexRadius() {
            if (this.map.getZoom() < 3) {
                return this.options.radius / (3 * (4 - this.map.getZoom()));
            } else if (this.map.getZoom() > 2 && this.map.getZoom() < 8) {
                return this.options.radius / (9 - this.map.getZoom());
            } else {
                return this.options.radius;
            }
        },

        onAdd(map) {
            this.map = map;
            let _layer = this;

            // SVG element
            this._svg = L.svg();
            map.addLayer(this._svg);
            // Todo: get rid of d3.select and use vanilla js instead
            this._rootGroup = d3.select(this._svg._rootGroup).classed('d3-overlay', true);
            this.selection = this._rootGroup;

            // Init shift/scale invariance helper values
            this._pixelOrigin = map.getPixelOrigin();
            this._wgsOrigin = L.latLng([0, 0]);
            this._wgsInitialShift = this.map.latLngToLayerPoint(this._wgsOrigin);
            this._zoom = this.map.getZoom();
            this._shift = L.point(0, 0);
            this._scale = 1;

            // Create projection object
            this.projection = {
                latLngToLayerPoint: function (latLng, zoom) {
                    zoom = _layer._undef(zoom) ? _layer._zoom : zoom;
                    let projectedPoint = _layer.map.project(L.latLng(latLng), zoom)._round();
                    return projectedPoint._subtract(_layer._pixelOrigin);
                }, layerPointToLatLng: function (point, zoom) {
                    zoom = _layer._undef(zoom) ? _layer._zoom : zoom;
                    let projectedPoint = L.point(point).add(_layer._pixelOrigin);
                    return _layer.map.unproject(projectedPoint, zoom);
                }, unitsPerMeter: 256 * Math.pow(2, _layer._zoom) / 40075017, map: _layer.map, layer: _layer, scale: 1
            };
            this.projection._projectPoint = function (x, y) {
                let point = _layer.projection.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            };

            this.projection.pathFromGeojson = geoPath().projection(geoTransform({point: this.projection._projectPoint}));
            this.projection.latLngToLayerFloatPoint = this.projection.latLngToLayerPoint;
            this.projection.getZoom = this.map.getZoom.bind(this.map);
            this.projection.getBounds = this.map.getBounds.bind(this.map);
            this.selection = this._rootGroup; // ???

            // Initial draw
            this.draw();
        }, addTo(map) {
            map.addLayer(this);
            return this;
        },

        _disableLeafletRounding() {
            this._leaflet_round = L.Point.prototype._round;
            L.Point.prototype._round = function () {
                return this;
            };
        },

        _enableLeafletRounding() {
            L.Point.prototype._round = this._leaflet_round;
        },

        draw() {
            this._disableLeafletRounding();
            this._redraw(this.selection, this.projection, this.map.getZoom());
            this._enableLeafletRounding();
        }, getEvents: function () {
            return {zoomend: this._zoomChange};
        },

        _zoomChange: function () {
            let mapZoom = map.getZoom();
            this._disableLeafletRounding();
            let newZoom = this._undef(mapZoom) ? this.map._zoom : mapZoom;
            this._zoomDiff = newZoom - this._zoom;
            this._scale = Math.pow(2, this._zoomDiff);
            this.projection.scale = this._scale;
            this._shift = this.map.latLngToLayerPoint(this._wgsOrigin)
                ._subtract(this._wgsInitialShift.multiplyBy(this._scale));
            let shift = ["translate(", this._shift.x, ",", this._shift.y, ") "];
            let scale = ["scale(", this._scale, ",", this._scale, ") "];
            this._rootGroup.attr("transform", shift.concat(scale).join(""));
            this.draw();
            this._enableLeafletRounding();
        }, _redraw(selection, projection, zoom) {
            // Generate the mapped version of the data
            let data = this._data.map((d) => {
                let lng = this.options.lng(d);
                let lat = this.options.lat(d);
                let point = projection.latLngToLayerPoint([lat, lng]);
                return {o: d, point: point};
            });

            // Select the hex group for the current zoom level. This has
            // the effect of recreating the group if the zoom level has changed
            let join = selection.selectAll('g.hexbin')
                .data([zoom], (d) => d);

            join.enter().append('g')
                .attr('class', (d) => 'hexbin zoom-' + d);

            join.exit().remove();

            // add the hexagons to the select
            this._createHexagons(join, data, projection);
        },

        _createHexagons(g, data, projection) {
            // Create the bins using the hexbin layout
            let hexbin = d3.hexbin()
                .radius(this.getFlexRadius() / projection.scale)
                .x((d) => d.point.x)
                .y((d) => d.point.y);
            let bins = hexbin(data);

            // Join - Join the Hexagons to the data
            let join = g.selectAll('path.hexbin-hexagon').data(bins);

            // Update - set the fill and opacity on a transition (opacity is re-applied in case the enter transition was cancelled)
            join.transition().duration(this.options.duration)
                .attr('fill', (d) => typeof this.options.value(d) === 'undefined' ? '#808080' : this._colorScale(this.options.value(d)))
                .attr('fill-opacity', this.options.opacity)
                .attr('stroke-opacity', this.options.opacity);

            // Enter - establish the path, the fill, and the initial opacity
            join.enter().append('path').attr('class', 'hexbin-hexagon')
                .attr('d', (d) => 'M' + d.x + ',' + d.y + hexbin.hexagon())
                .attr('fill', (d) => typeof this.options.value(d) === 'undefined' ? '#808080' : this._colorScale(this.options.value(d)))
                .on('click', this.options.click)
                .transition().duration(this.options.duration)
                .attr('fill-opacity', this.options.opacity)
                .attr('stroke-opacity', this.options.opacity);

            // Exit
            join.exit()
                .transition().duration(this.options.duration)
                .attr('fill-opacity', this.options.opacity)
                .attr('stroke-opacity', this.options.opacity)
                .remove();
        }, data(data) {
            this._data = (data != null) ? data : [];
            this.draw();
            return this;
        }
    });

    L.hexbinLayer = function (options) {
        return new L.HexbinLayer(options);
    };

    map.setView(coordsCenter, zoomLevel);
    map.clicked = 0;
    hexagonheatmap = L.hexbinLayer(config.scale_options[user_selected_value]).addTo(map);

    retrieveDataSC();
    retrieveDataSC2();
    // retrieveDataAtmoPACA();
    retrieveDataNebulo();

    map.on('moveend', function () {
        hexagonheatmap._zoomChange();
    });

    map.on('click', function () {
        clicked = null;
    });
    map.on('dblclick', function () {
        map.zoomIn();
        clicked += 1;
    });

    switchTo(user_selected_value)

    document.querySelector("#menuButton").onclick = toggleMenu;

// refresh data every 5 minutes
    setInterval(function () {
        document.querySelectorAll('path.hexbin-hexagon').forEach((e) => e.remove());
        retrieveDataSC()
    }, 300000);

    document.querySelectorAll(".selectCountry button").forEach(d => d.addEventListener("click", countrySelector));

    document.querySelectorAll(".select-items div").forEach(function (d) {
        d.addEventListener("click", function () {
            user_selected_value = this.getAttribute('value')
            !(user_selected_value === document.querySelector(".selected").getAttribute("value")) && switchTo(user_selected_value)
        })
    });
}

async function retrieveDataSC() {
    await api.getData(config.data_host + "/data/v2/data.dust.min.json", 'pmDefault').then(function (result) {
        hmhexaPM_aktuell = result.cells;
        console.log(hmhexaPM_aktuell);
        if (result.timestamp > timestamp_data) {
            timestamp_data = result.timestamp;
            timestamp_from = result.timestamp_from;
        }
    }).then(() => ready("pmDefault"))
}

function ready(vizType) {
    const date = new Date()
    const dateParser = timeParse("%Y-%m-%d %H:%M:%S");
    const getOffsetHours = date.getTimezoneOffset() * 60000
    const logTimestamp = dateParser(timestamp_data).getTime()
    const lastUpdateTimestamp = logTimestamp + (-getOffsetHours)
    const dateFormater = locale.format("%d.%m.%Y %H:%M:%S");

    document.querySelector("#menuButton").innerText = document.querySelector(".selected").innerText

    // if (vizType === "pmWHO" && (user_selected_value === "PM10who" || user_selected_value === "PM25who")) {
    //     hexagonheatmap.initialize(config.scale_options[user_selected_value]);
    //     hexagonheatmap.data(hmhexaPM_WHO);
    // }
    // if (vizType === "aqi" && user_selected_value === "AQIus") {
    //     hexagonheatmap.initialize(config.scale_options[user_selected_value]);
    //     hexagonheatmap.data(hmhexaPM_AQI);
    // }
    // if (vizType === "tempHumPress" && ["Temperature", "Humidity", "Pressure"].includes(user_selected_value)) {
    //     hexagonheatmap.initialize(config.scale_options[user_selected_value]);
    //     hexagonheatmap.data(hmhexa_t_h_p.filter(function (value) {
    //         return api.checkValues(value.data[user_selected_value], user_selected_value);
    //     }));
    // }
    // if (vizType === "Noise" && user_selected_value === "Noise") {
    //     hexagonheatmap.initialize(config.scale_options[user_selected_value]);
    //     hexagonheatmap.data(hmhexa_noise);
    // } else {
        hexagonheatmap.initialize(config.scale_options[user_selected_value]);
        hexagonheatmap.data(hmhexaPM_aktuell);
    // }
    
    document.querySelector("#loading").style.display = "none";
}

function data_median(data) {
    function sort_num(a, b) {
        let c = a - b;
        return (c < 0 ? -1 : (c = 0 ? 0 : 1));
    }

    let d_temp = data.filter(d => !d.o.indoor)
        .map(o => o.o.data[user_selected_value])
        .sort(sort_num);
    return median(d_temp);
}

function reloadMap(val) {
    document.querySelectorAll('path.hexbin-hexagon').forEach(function (d) {
        d.remove();
    });
    hexagonheatmap.initialize(config.scale_options[val]);
    if (val === "PM10" || val === "PM25") {
        hexagonheatmap.data(hmhexaPM_aktuell);
    } else if (val === "PM10eu" || val === "PM25eu") {
        hexagonheatmap.data(hmhexaPM_EU);
    } else if (val === "PM10who" || val === "PM25who") {
        hexagonheatmap.data(hmhexaPM_WHO);
    } else if (val === "AQIus") {
        hexagonheatmap.data(hmhexaPM_AQI);
    } else if (["Temperature", "Humidity", "Pressure"].includes(val)) {
        hexagonheatmap.data(hmhexa_t_h_p.filter(function (value) {
            return api.checkValues(value.data[user_selected_value], user_selected_value);
        }));
    } else if (val === "Noise") {
        hexagonheatmap.data(hmhexa_noise);
    }
    switchLegend(val);
}

function sensorNr(data) {
    openMenu()
    document.getElementById("mainContainer").style.display = "none"; // hide menu content
    let textefin = "<table id='results' style='width:95%;'><tr><th class ='title'>" + 'Sensor' + "</th><th class = 'title'>" + config.tableTitles[user_selected_value] + "</th></tr>";
    if (data.length > 1) {
        textefin += "<tr><td class='idsens'>Median " + data.length + " Sensors</td><td>" + (isNaN(parseInt(data_median(data))) ? "-" : parseInt(data_median(data))) + "</td></tr>";
    }
    let sensors = '';
    data.forEach(function (i) {
        sensors += "<tr><td class='idsens' id='id_" + i.o.id + (i.o.indoor ? "_indoor" : "") + "'> #" + i.o.id + (i.o.indoor ? " (indoor)" : "") + "</td>";
        if (["PM10", "PM25", "PM10eu", "PM25eu", "PM10who", "PM25who", "Temperature", "Humidity", "Noise"].includes(user_selected_value)) {
            sensors += "<td>" + i.o.data[user_selected_value] + "</td></tr>";
        }
        if (user_selected_value === "AQIus") {
            sensors += "<td>" + i.o.data[user_selected_value] + " (" + i.o.data.origin + ")</td></tr>";
        }
        if (user_selected_value === "Pressure") {
            sensors += "<td>" + i.o.data[user_selected_value].toFixed(1) + "</td></tr>";
        }
        sensors += "<tr id='graph_" + i.o.id + "'></tr>";
    });
    textefin += sensors;
    textefin += "</table>";
    document.querySelector('#table').innerHTML = textefin;
    document.querySelectorAll('.idsens').forEach(function (d) {
        d.addEventListener('click', function () {
            displayGraph(this.id); // transfer id e.g. id_67849
        });
    });
}

async function displayGraph(id) {
    const panel_str = "<iframe src='https://maps.sensor.community/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=<PANELID>&var-node=<SENSOR>' frameborder='0' height='300px' width='100%'></iframe>";
    const sens = id.substr(3);
    const sens_id = sens.replace("_indoor", "");
    const sens_desc = sens.replace("_indoor", " (indoor)");

    if (!openedGraph1.includes(sens_id)) {
        openedGraph1.push(sens_id);
        const iframeID = 'frame_' + sens_id
        document.querySelector("#graph_" + sens_id).appendChild(document.createElement('td')).setAttribute('id', iframeID);
        document.querySelector('#' + iframeID).setAttribute('colspan', '2')
        document.querySelector('#' + iframeID).innerHTML = ((config.panelIDs[user_selected_value][0] > 0 ? panel_str.replace("<PANELID>", config.panelIDs[user_selected_value][0]).replace("<SENSOR>", sens_id) + "<br/>" : "") + (config.panelIDs[user_selected_value][1] > 0 ? panel_str.replace("<PANELID>", config.panelIDs[user_selected_value][1]).replace("<SENSOR>", sens_id) : ""))

        document.querySelector("#id_" + sens).innerText = "(-) #" + sens_desc
    } else {
        document.querySelector("#id_" + sens).innerText = "(+) #" + sens_desc
        document.querySelector('#frame_' + sens_id).remove();
        removeInArray(openedGraph1, sens_id);
    }
}

function removeInArray(array) {
    let what, a = arguments, L = a.length, ax;
    while (L > 1 && array.length) {
        what = a[--L];
        while ((ax = array.indexOf(what)) !== -1) {
            array.splice(ax, 1);
        }
    }
    return array;
}

function switchTo(user_selected_value) {
    let elem = document.querySelector(`div[value='${user_selected_value}']`)
    document.querySelector('.selected').classList.remove("selected"); // remove class selected
    elem.classList.add("selected");
    reloadMap(user_selected_value)
    switchLegend(user_selected_value)
    closeMenu()
}

function switchLegend(val) {
    document.querySelectorAll('[id^=legend_]').forEach(d => d.style.display = "none");
    document.querySelector("#legend_" + val).style.display = "block";
}

function openMenu() {
    document.getElementById("menuButton").innerHTML = "&#10006;";
    document.getElementById("modal").style.display = "block";
    document.getElementById("mainContainer").style.display = "block";
}

function closeMenu() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("mainContainer").style.display = "none";
    document.querySelector("#menuButton").innerText = document.querySelector('.selected').innerText;
    (document.querySelector('#results')) ? document.querySelector('#results').remove() : null;
}

function toggleMenu() {
    (document.getElementById("modal").style.display === "block") ? closeMenu() : openMenu();
}

function colorScaler(option,value){

    if (typeof value == 'object'){
        
        if (value != null){
        if(option == "PM10"){return colorScalePM10(value.PM10);};  
        if(option == "PM25"){return colorScalePM25(value.PM25);};    
        if(option == "PM1"){return colorScalePM1(value.PM1);}; 
        }else{
            return 'grey';
        }
        
     }else if (typeof value == 'number'){ 
        if(option == "PM10"){ return colorScalePM10(value);};
        if(option == "PM25"){return colorScalePM25(value);};    
        if(option == "PM1"){return colorScalePM1(value);};   
     }else{console.log(typeof value)};
};


async function retrieveDataSC2() {
        
    var urlapi = "https://data.sensor.community/airrohr/v1/filter/box=43.439306,5.629051,43.13605,5.161638";

        
    api2.getData(urlapi, 1).then(function (result) {
        if (result.timestamp > timestamp_data) {
            timestamp_data = result.timestamp;
            timestamp_from = result.timestamp_from;
        }

const dateParser = timeParse("%Y-%m-%d %H:%M:%S");
const timestamp = dateParser(timestamp_data);
const localTime = new Date();
const timeOffset = localTime.getTimezoneOffset();
const newTime = timeMinute.offset(timestamp, -(timeOffset));
const dateFormater = locale.format("%H:%M:%S");

d3.select("#update").html("Last update" + ": " + dateFormater(newTime));
console.log("Timestamp " + timestamp_data + " from " + timestamp_from);

var mapper = result.cells.map(function(obj){
    var SCfeature = { "type": "Feature", "properties": { "id": 0, "data": {}, "indoor": 0}, "geometry": { "type": "Point", "coordinates": []}};

    SCfeature.geometry.coordinates[0] = obj.longitude;
    SCfeature.geometry.coordinates[1] = obj.latitude;
    SCfeature.properties.id = obj.id;
    SCfeature.properties.indoor = obj.indoor;
    SCfeature.properties.data = obj.data;

    return SCfeature;
    })

SC_PM.features = mapper;

console.log(SC_PM);

SCSensorsMap.clearLayers();
SCSensorsMap.addData(SC_PM).bringToBack();
        
if(logger.sc.display == true){
    SCSensorsMap.clearLayers();
    SCSensorsMap.addData(SC_PM).bringToBack();
    
};
});    
}


async function retrieveDataAtmoPACA() {

    var URL = "https://geoservices.atmosud.org/geoserver/mes_sudpaca_horaire_poll_princ/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mes_sudpaca_horaire_poll_princ:mes_sudpaca_horaire_3j&outputFormat=application/json&srsName=EPSG:4326"
    
    PACAdata.getData(URL)
        .then(function (result) {
            
        AtmoPACAData.PM10.features = result.PM10;
        AtmoPACAData.PM25.features = result.PM25;
        return getCurrentPACA(AtmoPACAData);
        })
        .then(function (result){
        
        console.log(result)
        
        AtmoPACADataCurrent.PM10.features = result.PM10;
        AtmoPACADataCurrent.PM25.features = result.PM25;
        
    if(user_selected_value == "PM10"){
        AtmoPACAStationsMap.clearLayers();
        AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM10).bringToFront();
        };
    
         if(user_selected_value == "PM25"){
        AtmoPACAStationsMap.clearLayers();
        AtmoPACAStationsMap.addData(AtmoPACADataCurrent.PM25).bringToFront();
        };
    
    }); 
    }

    function getCurrentPACA(data){
    
        var dataOut = {"PM10":[],"PM25":[]};
        
    //    "2021/04/21 00:59"
        
        var parseDate = timeParse("%Y/%m/%d %H:%M");
        var listeSitesPM10 = [];
        var listeSitesPM25 = [];
        
        
        data.PM10.features.forEach(function(e){
            if(!listeSitesPM10.includes(e.properties.code_station)){        
                    listeSitesPM10.push(e.properties.code_station)}     
            });
        
        listeSitesPM10.forEach(function(e){
            var filter = data.PM10.features.filter(o => o.properties.code_station == e)
            
            filter.sort(function(a,b){
              return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
            });
    //      current.push(filter[filter.length-1])
            dataOut.PM10.push(filter[filter.length-1])        
        });
        
    
            data.PM25.features.forEach(function(e){
            if(!listeSitesPM25.includes(e.properties.code_station)){        
                    listeSitesPM25.push(e.properties.code_station)}     
            });
        
        listeSitesPM25.forEach(function(e){
            var filter = data.PM25.features.filter(o => o.properties.code_station == e)
            
            filter.sort(function(a,b){
              return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
            });
    //      current.push(filter[filter.length-1])
            dataOut.PM25.push(filter[filter.length-1])        
        });
         
        
     return dataOut   
    }


    async function retrieveDataNebulo() {

        var URL = "https://moduleair.fr/devices/API/nebulo_lastMeasure.php"
        
        Nebulodata.getData(URL)
            .then(function (result) {
        
            console.log(result);
            
            // NebuloData.PM10.features = result.PM10;
            // NebuloData.PM25.features = result.PM25;
            // NebuloData.PM25.features = result.PM25;
            
            // console.log(NebuloData)

            var mapper = result.map(function(obj){
                var Nebulofeature = { "type": "Feature", "properties": { "id": 0, "data": {"PM1":0,"PM25":0,"PM10":0}}, "geometry": { "type": "Point", "coordinates": []}};
            
                Nebulofeature.geometry.coordinates[0] = parseFloat(obj.longitude);
                Nebulofeature.geometry.coordinates[1] = parseFloat(obj.latitude);
                Nebulofeature.properties.id = obj.sensorId;
                Nebulofeature.properties.data.PM1 = obj.PM1;
                Nebulofeature.properties.data.PM25 = obj.PM25;
                Nebulofeature.properties.data.PM10 = obj.PM10;
            
                return Nebulofeature;
                })
            
                NebuloData.features = mapper;
            
            console.log(NebuloData);
            
            AirCartoSensorsMap.clearLayers();
            AirCartoSensorsMap.addData(NebuloData).bringToBack();
                    
            if(logger.sc.display == true){
                AirCartoSensorsMap.clearLayers();
                AirCartoSensorsMap.addData(NebuloData).bringToBack();
                
            };

            
            
        // if(user_selected_value == "PM10"){
        //     AirCartoSensorsMap.clearLayers();
        //     AirCartoSensorsMap.addData(NebuloData.PM10).bringToFront();
        //     };
        
        //      if(user_selected_value == "PM25"){
        //         AirCartoSensorsMap.clearLayers();
        //         AirCartoSensorsMap.addData(NebuloData.PM25).bringToFront();
        //     };
        
        //     if(user_selected_value == "PM1"){
        //         AirCartoSensorsMap.clearLayers();
        //         AirCartoSensorsMap.addData(NebuloData.PM25).bringToFront();
        //         };

        }); 
        }




const colorScalePM10 = scaleLinear()
    .domain(scale_options.PM10.valueDomain)
    .range(scale_options.PM10.colorRange)
    .interpolate(interpolateRgb);
       
       
 const colorScalePM25 = scaleLinear()
    .domain(scale_options.PM25.valueDomain)
    .range(scale_options.PM25.colorRange)
    .interpolate(interpolateRgb);

const colorScalePM1 = scaleLinear()
    .domain(scale_options.PM1.valueDomain)
    .range(scale_options.PM1.colorRange)
    .interpolate(interpolateRgb);

