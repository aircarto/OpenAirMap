// import leaflet
import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import * as L from 'leaflet';

// d3 libraries
import * as d3_Hexbin from "d3-hexbin";
import * as d3_Selection from 'd3-selection';
import * as d3_Transition from "d3-transition";
import { scaleLinear } from 'd3-scale';
import { geoPath, geoTransform } from 'd3-geo';
import { timeMinute } from 'd3-time';
import { timeFormatLocale, timeParse, timeFormat } from 'd3-time-format';
import { median } from 'd3-array';
import { interpolateRgb } from 'd3-interpolate';
import { csvParse } from 'd3-dsv';
import { line } from 'd3-shape';
import { csv } from 'd3-fetch';
import { extent, max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';


import 'whatwg-fetch';

const d3 = Object.assign({}, d3_Selection, d3_Hexbin);

import api from './feinstaub-api';
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

let SensorCommunityData = { "type": "FeatureCollection", "name": "SCSensors", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] };

let NebuloData = { "type": "FeatureCollection", "name": "Nebulo", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] };

let AtmoSudData = { PM10: { "type": "FeatureCollection", "name": "stations_AtmoSud_PM10", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] }, PM25: { "type": "FeatureCollection", "name": "stations_AtmoSud_PM25", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] } };

let AtmoSudDataCurrent = { PM10: { "type": "FeatureCollection", "name": "stations_AtmoAURA_PM10", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] }, PM25: { "type": "FeatureCollection", "name": "stations_AtmoAURA_PM25", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [] } };

// let AtmoPurpleData ={PM10:{"type": "FeatureCollection","name": "Purple_Air","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

// let AtmoPurpleDataCurrent ={PM10:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM10","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []},PM25:{"type": "FeatureCollection","name": "stations_AtmoAURA_PM25","crs": { "type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84" }},"features": []}};

const scale_options = config.scale_options;


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




//config.scaleoptions

//REVOIR LES COULEURS

var timer0 = new Date

//mettre dans config?

var logger = {
    "sc": { "display": false, "data": false, "time": timer0 },
    "atmosud": { "display": false, "data": false, "time": timer0 },
    "purple": { "display": false, "data": false, "time": timer0 },
    "nebulo": { "display": false, "data": false, "time": timer0 }
};

const panelIDs = config.panelIDs;

let openedGraph1 = [];
let timestamp_data = '';			// needs to be global to work over all 4 data streams
let timestamp_from = '';			// needs to be global to work over all 4 data streams
let clicked = null;

let user_selected_value = config.sensor;
let coordsCenter = config.initialView;
let zoomLevel = config.initialZoom;

const locale = timeFormatLocale(config.locale);

const map = L.map("map", { preferCanvas: true, zoomControl: false, controls: false }).setView(config.initialView, config.initialZoom);
map.attributionControl.setPosition('bottomleft')

config.tiles = config.tiles_server + config.tiles_path;

L.tileLayer(config.tiles, {
    maxZoom: config.maxZoom, minZoom: config.minZoom, subdomains: config.tiles_subdomains,
}).addTo(map);
// Adds query and hash parameter to the current URL
new L.Hash(map);

const query = {
    sensor: config.sensor
};

// iife function to read query parameter from URL
(function () {
    let query_value;
    const search_values = location.search.replace('\?', '').split('&');
    for (let i = 0; i < search_values.length; i++) {
        query_value = search_values[i].split('=');
        (typeof query_value[0] != 'sensor' && undefined) ? user_selected_value = query_value[1] : user_selected_value = config.sensor;
    }
})();


config.sensor = (query.sensor !== undefined) ? query.sensor : config.sensor;
d3.select("#custom-select").select("select").property("value", config.sensor);


// // Intitialisation of the Leaflet Layers for each dataset

var AtmoSudStationsMap = L.geoJSON(AtmoSudDataCurrent.PM25, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,
            fillColor: colorScaler(user_selected_value, feature.properties.valeur),
            weight: 2,
            stroke: true,
            color: 'black',
            fillOpacity: 1
        })
    },
    onEachFeature: function (feature, layer) {

        if (feature.properties.valeur == -1) { feature.properties.valeur = "N/A" };

        var popupContent = "<h2>AtmoSud</h2><p><b>Name</b> : " + feature.properties.nom_station + "</p><p><b>Value</b> : " + feature.properties.valeur + " µg\/m&sup3; (" + feature.properties.influence + ")</p><button type='button' id='button" + feature.properties.code_station + "' value='" + feature.properties.code_station + "'>Show graph!</button><div id='graph" + feature.properties.code_station + "'></div>";
        layer.bindPopup(popupContent, { closeOnClick: false, autoClose: false, closeButton: true });
    }


}).addTo(map);


var SCSensorsMap = L.geoJSON(SensorCommunityData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 20,
            fillColor: colorScaler(user_selected_value, feature.properties.data),
            weight: 2,
            stroke: true,
            color: 'blue',
            fillOpacity: 1
        })
    },
    onEachFeature: function (feature, layer) {
        var popupContent = "<h2>Sensor.Community</h2><p><b>Sensor ID</b> : " + feature.properties.id + "</p><p><b>PM10</b> : " + feature.properties.data.PM10 + " µg\/m&sup3;</p><p><b>PM25</b> : " + feature.properties.data.PM25 + " µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph" + feature.properties.id + "'></div>";
        layer.bindPopup(popupContent, { closeOnClick: false, autoClose: false, closeButton: true });
    }
}).addTo(map);


var AirCartoSensorsMap = L.geoJSON(SensorCommunityData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,
            fillColor: colorScaler(user_selected_value, feature.properties.data),
            weight: 2,
            stroke: true,
            color: 'red',
            fillOpacity: 1
        })
    },
    onEachFeature: function (feature, layer) {
        var popupContent = "<h2>Nebulo AirCarto</h2><p><b>Sensor ID</b> : " + feature.properties.id + "</p><p><b>PM10</b> : " + feature.properties.data.PM10 + " µg\/m&sup3;</p><p><b>PM25</b> : " + feature.properties.data.PM25 + " µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph" + feature.properties.id + "'></div>";
        layer.bindPopup(popupContent, { closeOnClick: false, autoClose: false, closeButton: true });
    }
}).addTo(map);

// const myCustomColour = '#583470'


// const markerHtmlStyles = `
// iconUrl: '../images/icons/aircarto.png',  
// background-color: ${myCustomColour};
//   width: 3rem;
//   height: 3rem;
//   display: block;
//   left: -1.5rem;
//   top: -1.5rem;
//   position: relative;
//   border-radius: 3rem 3rem 0;
//   transform: rotate(45deg);
//   border: 1px solid #FFFFFF`

// const aircartoicon = L.divIcon({
//   className: "my-custom-pin",
//   iconAnchor: [0, 24],
//   labelAnchor: [-6, 0],
//   popupAnchor: [0, -36],
//   html: `<span style="${markerHtmlStyles}" />`
// })


//     var AirCartoSensorsMap = L.geoJSON(SensorCommunityData,{
//         pointToLayer: function (feature, latlng) {


//          return L.Marker(latlng)
//         },
//         onEachFeature: function (feature, layer) {
//           var popupContent = "<h2>Nebulo AirCarto</h2><p><b>Sensor ID</b> : "+feature.properties.id+"</p><p><b>PM10</b> : "+feature.properties.data.PM10+" µg\/m&sup3;</p><p><b>PM25</b> : "+feature.properties.data.PM25+" µg\/m&sup3;</p><button type='button' id='button" + feature.properties.id + "' value='" + feature.properties.id + "'>Show graph!</button><div id='graph"+ feature.properties.id +"'></div>";
//           layer.bindPopup(popupContent,{closeOnClick: false,autoClose: false,closeButton:true});
//         }}).addTo(map);


// var PurpleSensorsMap = L.geoJSON(SensorCommunityData,{
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

//         var AtmoSudStationsMap = L.geoJSON(AtmoSudDataCurrent.PM25,{
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


    map.setView(coordsCenter, zoomLevel);
    map.clicked = 0;

    //retrieveDataSC();
    // retrieveDataAtmoSud();
    retrieveDataNebulo();

    map.on('moveend', function () {
        // hexagonheatmap._zoomChange();
    });

    map.on('click', function () {
        clicked = null;
    });
    map.on('dblclick', function () {
        map.zoomIn();
        clicked += 1;
    });


    //    Events for the checkboxes

    d3.select("#sc").on("change", function () { switcher("sc", SCSensorsMap) });
    d3.select("#nebulo").on("change", function () { switcher("nebulo", AirCartoSensorsMap) });
    d3.select("#atmosud").on("change", function () { switcher("atmosud", AtmoSudStationsMap) });
    // d3.select("#uba").on("change", function (){switcher("purple",PurpleAirSensorsMap)});
    //    d3.select("#aura").on("change", switchAURA);
    //    d3.select("#paca").on("change", switchPACA);
    //    d3.select("#occi").on("change", switchOccitanie);
    //    d3.select("#lucht").on("change", switchLuchtmeetnet);


    // //    Events for the radios


    //     d3.selectAll('input[type="radio"][name="sc"]').on("change", function (){switcher2("sc",this.value,SCSensorsMap)});
    // //    d3.selectAll('input[type="radio"][name="eea"]').on("change", function (){switcher2("eea",this.value,SCSensorsMap)});
    //     d3.selectAll('input[type="radio"][name="uba"]').on("change", function (){switcher2("uba",this.value,UBAStationsMap)});
    // //    d3.selectAll('input[type="radio"][name="aura"]').on("change", function (){switcher2("aura",this.value,SCSensorsMap)});
    // //    d3.selectAll('input[type="radio"][name="paca"]').on("change", function (){switcher2("paca",this.value,SCSensorsMap)});
    // //    d3.selectAll('input[type="radio"][name="occi"]').on("change", function (){switcher2("occi",this.value,SCSensorsMap)});
    // //    d3.selectAll('input[type="radio"][name="lucht"]').on("change", function (){switcher2("lucht",this.value,SCSensorsMap)});





    switchTo(user_selected_value)

    document.querySelector("#menuButton").onclick = toggleMenu;

    // refresh data every 5 minutes
    setInterval(function () {
        retrieveDataSC()
    }, 300000);

    document.querySelectorAll(".select-items div").forEach(function (d) {
        d.addEventListener("click", function () {
            user_selected_value = this.getAttribute('value')
            !(user_selected_value === document.querySelector(".selected").getAttribute("value")) && switchTo(user_selected_value)
        })
    });
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
    // switchLegend(val);

    console.log("RELOAD");
    console.log(val);

    SCSensorsMap.clearLayers();
    SCSensorsMap.addData(SensorCommunityData).bringToFront();

    if (val == "PM10") {
        // EUStationsMap.clearLayers();
        // EUStationsMap.addData(EUofficialData.PM10).bringToFront(); 
        // UBAStationsMap.clearLayers();
        // UBAStationsMap.addData(UBAofficialData.PM10).bringToFront(); 
        // LuchtmeetnetStationsMap.clearLayers();
        // LuchtmeetnetStationsMap.addData(EUofficialData.PM10).bringToFront();
        // AtmoAURAStationsMap.clearLayers();
        // AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM10).bringToFront();
        // AtmoSudStationsMap.clearLayers();
        // AtmoSudStationsMap.addData(AtmoSudDataCurrent.PM10).bringToFront();
        // UBAStationsMap.clearLayers();
        // UBAStationsMap.addData(UBAofficialData.PM10).bringToFront();
    };

    if (val == "PM25") {
        // EUStationsMap.clearLayers();
        // EUStationsMap.addData(EUofficialData.PM25).bringToFront();
        // LuchtmeetnetStationsMap.clearLayers();
        // LuchtmeetnetStationsMap.addData(EUofficialData.PM25).bringToFront();
        // AtmoAURAStationsMap.clearLayers();
        // AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
        // AtmoSudStationsMap.clearLayers();
        // AtmoSudStationsMap.addData(AtmoSudDataCurrent.PM25).bringToFront();
        // AtmoOccitanieStationsMap.clearLayers();
        // AtmoOccitanieStationsMap.addData(AtmoOccitanieDataCurrent.PM25).bringToFront(); 
        // UBAStationsMap.clearLayers();
        // UBAStationsMap.addData(UBAofficialData.PM25).bringToFront();   
    };

    if (val == "PM1") {
        // EUStationsMap.clearLayers();
        // EUStationsMap.addData(EUofficialData.PM25).bringToFront();
        // LuchtmeetnetStationsMap.clearLayers();
        // LuchtmeetnetStationsMap.addData(EUofficialData.PM25).bringToFront();
        // AtmoAURAStationsMap.clearLayers();
        // AtmoAURAStationsMap.addData(AtmoAURADataCurrent.PM25).bringToFront();
        // AtmoSudStationsMap.clearLayers();
        // AtmoSudStationsMap.addData(AtmoSudDataCurrent.PM25).bringToFront();
        // AtmoOccitanieStationsMap.clearLayers();
        // AtmoOccitanieStationsMap.addData(AtmoOccitanieDataCurrent.PM25).bringToFront(); 
        // UBAStationsMap.clearLayers();
        // UBAStationsMap.addData(UBAofficialData.PM25).bringToFront();   
    };
}

// function sensorNr(data) {
//     openMenu()
//     document.getElementById("mainContainer").style.display = "none"; // hide menu content
//     let textefin = "<table id='results' style='width:95%;'><tr><th class ='title'>" + 'Sensor' + "</th><th class = 'title'>" + config.tableTitles[user_selected_value] + "</th></tr>";
//     if (data.length > 1) {
//         textefin += "<tr><td class='idsens'>Median " + data.length + " Sensors</td><td>" + (isNaN(parseInt(data_median(data))) ? "-" : parseInt(data_median(data))) + "</td></tr>";
//     }
//     let sensors = '';
//     data.forEach(function (i) {
//         sensors += "<tr><td class='idsens' id='id_" + i.o.id + (i.o.indoor ? "_indoor" : "") + "'> #" + i.o.id + (i.o.indoor ? " (indoor)" : "") + "</td>";
//         if (["PM10", "PM25", "PM10eu", "PM25eu", "PM10who", "PM25who", "Temperature", "Humidity", "Noise"].includes(user_selected_value)) {
//             sensors += "<td>" + i.o.data[user_selected_value] + "</td></tr>";
//         }
//         if (user_selected_value === "AQIus") {
//             sensors += "<td>" + i.o.data[user_selected_value] + " (" + i.o.data.origin + ")</td></tr>";
//         }
//         if (user_selected_value === "Pressure") {
//             sensors += "<td>" + i.o.data[user_selected_value].toFixed(1) + "</td></tr>";
//         }
//         sensors += "<tr id='graph_" + i.o.id + "'></tr>";
//     });
//     textefin += sensors;
//     textefin += "</table>";
//     document.querySelector('#table').innerHTML = textefin;
//     document.querySelectorAll('.idsens').forEach(function (d) {
//         d.addEventListener('click', function () {
//             displayGraph(this.id); // transfer id e.g. id_67849
//         });
//     });
// }

// async function displayGraph(id) {
//     const panel_str = "<iframe src='https://maps.sensor.community/grafana/d-solo/000000004/single-sensor-view?orgId=1&panelId=<PANELID>&var-node=<SENSOR>' frameborder='0' height='300px' width='100%'></iframe>";
//     const sens = id.substr(3);
//     const sens_id = sens.replace("_indoor", "");
//     const sens_desc = sens.replace("_indoor", " (indoor)");

//     if (!openedGraph1.includes(sens_id)) {
//         openedGraph1.push(sens_id);
//         const iframeID = 'frame_' + sens_id
//         document.querySelector("#graph_" + sens_id).appendChild(document.createElement('td')).setAttribute('id', iframeID);
//         document.querySelector('#' + iframeID).setAttribute('colspan', '2')
//         document.querySelector('#' + iframeID).innerHTML = ((config.panelIDs[user_selected_value][0] > 0 ? panel_str.replace("<PANELID>", config.panelIDs[user_selected_value][0]).replace("<SENSOR>", sens_id) + "<br/>" : "") + (config.panelIDs[user_selected_value][1] > 0 ? panel_str.replace("<PANELID>", config.panelIDs[user_selected_value][1]).replace("<SENSOR>", sens_id) : ""))

//         document.querySelector("#id_" + sens).innerText = "(-) #" + sens_desc
//     } else {
//         document.querySelector("#id_" + sens).innerText = "(+) #" + sens_desc
//         document.querySelector('#frame_' + sens_id).remove();
//         removeInArray(openedGraph1, sens_id);
//     }
// }

// function removeInArray(array) {
//     let what, a = arguments, L = a.length, ax;
//     while (L > 1 && array.length) {
//         what = a[--L];
//         while ((ax = array.indexOf(what)) !== -1) {
//             array.splice(ax, 1);
//         }
//     }
//     return array;
// }

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

function colorScaler(option, value) {

    if (typeof value == 'object') {

        if (value != null) {
            if (option == "PM10") { return colorScalePM10(value.PM10); };
            if (option == "PM25") { return colorScalePM25(value.PM25); };
            if (option == "PM1") { if(value.PM1 == -1){return '#808080'}else{return colorScalePM1(value.PM1);} };
        } else {
            return 'grey';
        }

    } else if (typeof value == 'number') {
        if (option == "PM10") { return colorScalePM10(value); };
        if (option == "PM25") { return colorScalePM25(value); };
        if (option == "PM1") { return colorScalePM1(value); };
    } else { console.log(typeof value) };
};


async function retrieveDataSC() {

    var urlapi = "https://data.sensor.community/airrohr/v1/filter/box=43.439306,5.629051,43.13605,5.161638";


    api.getData(urlapi, 1).then(function (result) {
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

        var mapper = result.cells.map(function (obj) {
            var SCfeature = { "type": "Feature", "properties": { "id": 0, "data": {}, "indoor": 0 }, "geometry": { "type": "Point", "coordinates": [] } };

            console.log(obj);

            SCfeature.geometry.coordinates[0] = obj.longitude;
            SCfeature.geometry.coordinates[1] = obj.latitude;
            SCfeature.properties.id = obj.id;
            SCfeature.properties.indoor = obj.indoor;
            SCfeature.properties.data = obj.data;

            return SCfeature;
        })

        SensorCommunityData.features = mapper;

        console.log(SensorCommunityData);

        // SCSensorsMap.clearLayers();
        // SCSensorsMap.addData(SensorCommunityData).bringToBack();

        if (logger.sc.display == true) {
            SCSensorsMap.clearLayers();
            SCSensorsMap.addData(SensorCommunityData).bringToBack();

        };
    });

    logger.sc.data == true;

}


async function retrieveDataAtmoSud() {

    var URL = "https://geoservices.atmosud.org/geoserver/mes_sudpaca_horaire_poll_princ/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mes_sudpaca_horaire_poll_princ:mes_sudpaca_horaire_3j&outputFormat=application/json&srsName=EPSG:4326"

    PACAdata.getData(URL)
        .then(function (result) {

            AtmoSudData.PM10.features = result.PM10;
            AtmoSudData.PM25.features = result.PM25;
            return getCurrentPACA(AtmoSudData);
        })
        .then(function (result) {

            console.log(result)

            AtmoSudDataCurrent.PM10.features = result.PM10;
            AtmoSudDataCurrent.PM25.features = result.PM25;

            if (user_selected_value == "PM10") {
                AtmoSudStationsMap.clearLayers();
                AtmoSudStationsMap.addData(AtmoSudDataCurrent.PM10).bringToFront();
            };

            if (user_selected_value == "PM25") {
                AtmoSudStationsMap.clearLayers();
                AtmoSudStationsMap.addData(AtmoSudDataCurrent.PM25).bringToFront();
            };

        });
}

function getCurrentPACA(data) {

    var dataOut = { "PM10": [], "PM25": [] };

    //    "2021/04/21 00:59"

    var parseDate = timeParse("%Y/%m/%d %H:%M");
    var listeSitesPM10 = [];
    var listeSitesPM25 = [];


    data.PM10.features.forEach(function (e) {
        if (!listeSitesPM10.includes(e.properties.code_station)) {
            listeSitesPM10.push(e.properties.code_station)
        }
    });

    listeSitesPM10.forEach(function (e) {
        var filter = data.PM10.features.filter(o => o.properties.code_station == e)

        filter.sort(function (a, b) {
            return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
        //      current.push(filter[filter.length-1])
        dataOut.PM10.push(filter[filter.length - 1])
    });


    data.PM25.features.forEach(function (e) {
        if (!listeSitesPM25.includes(e.properties.code_station)) {
            listeSitesPM25.push(e.properties.code_station)
        }
    });

    listeSitesPM25.forEach(function (e) {
        var filter = data.PM25.features.filter(o => o.properties.code_station == e)

        filter.sort(function (a, b) {
            return new Date(parseDate(a.properties.date_fin)) - new Date(parseDate(b.properties.date_fin));
        });
        //      current.push(filter[filter.length-1])
        dataOut.PM25.push(filter[filter.length - 1])
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

            var mapper = result.map(function (obj) {
                var Nebulofeature = { "type": "Feature", "properties": { "id": 0, "data": { "PM1": 0, "PM25": 0, "PM10": 0 } }, "geometry": { "type": "Point", "coordinates": [] } };

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

            if (logger.sc.display == true) {
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



function switcher(key, geojson) {

    console.log("SWITCH");
    console.log(key);

    console.log(logger[key].data);

    if (d3.select("#" + key).property("checked")) {
        logger[key].display = true;

        console.log(logger[key].display);

        if (logger[key].data == false && d3.selectAll('input[type="radio"][name="' + key + '"]:checked').node() != null) {
            var option = d3.selectAll('input[type="radio"][name="' + key + '"]:checked').node().value;
            logger[key].data = option;
            //voir apres pour option daily etc,
            switch (key) {
                case "sc":
                    retrieveDataSC();
                    break;
                case "atmosud":
                    retrieveDataAtmoSud();
                    break;
                case "nebulo":
                    retrieveDataNebulo();
                    break;
                case "purple":

                    break;
            }
        } else {
            switch (key) {
                case "sc":
                    geojson.addData(SensorCommunityData).bringToFront();
                    break;
                case "atmosud":
                    geojson.addData(AtmoSudData).bringToFront();
                    break;
                case "nebulo":
                    geojson.addData(NebuloData).bringToFront();

                    break;
                case "purple":

                    break;
            };
        }
    } else {
        geojson.clearLayers();
        logger[key].display = false;
    }
}


function switcher2(key, option, geojson) {

    console.log("SWITCH2");
    console.log(key);
    console.log(option);

    logger[key].data = option;

    switch (key) {
        case "sc":
            retrieveData(option);
            break;
        case "eea":

            break;
        case "uba":
            retrieveDataUBA(option);
            break;
        case "aura":

            break;
        case "paca":

            break;
        case "occi":

            break;
        case "lucht":

            break;
    };
}








