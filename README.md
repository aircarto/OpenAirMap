# OpenAirMap

![mapImage](images/example_OpenAirMap.jpg)

 Map of all outdoors air quality sensors in southern France.

 Project developped with [AirCarto](https://www.aircarto.fr) and [AtmoSud](https://www.atmosud.org/).

 This is a javascript app running with node.js.

 Javascript libraries and frameworks used in this project:

 * Leaflet
 * d3
 * dotenv

## Sensors

The app will get air quality data from multiples sensors and their API.

* Nebulo from AirCarto
* Purple Air
* Sensor.Community
* AtmoSud


## Deploy

### Installation
Requirements:
* [Node JS](https://nodejs.org/) 10.15.x or higher
* NPM should be version 6.9.x or higher

install all dependencies

```
cp src/js/config.js.dist src/js/config.js
npm install
```

### Develop
start development server (http://127.0.0.1:8080/)

```
npm start
```

### Publish
build all files needed to run on a webserver, files will be compiled into `dist/`):

```
npm run build
npm run ghpages
```

## URL-Parameter

### Sensor 
valid sensor parameters PM25, PM10, Pressure, Noise, Humidity & AQIus 
http://127.0.0.1:8080/?sensor=Noise

### Location 
valid parameters zoom level, lat and long 
http://127.0.0.1:8080/#9/48.8123/9.2487

### combine parameters
first start with sensor, then layers and finally location
http://127.0.0.1:8080/?sensor=Noise#3/48.8123/9.2487

