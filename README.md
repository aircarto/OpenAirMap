# OpenAirMap

![mapImage](app/img/example_OpenAirMap.jpg)

Map of all outdoors air quality sensors in southern France.

Project developped with [AirCarto](https://www.aircarto.fr) and [AtmoSud](https://www.atmosud.org/).

Javascript libraries and frameworks used in this project:

To deploy the app you need a web server such as Apache or Nginx with the last version of PHP and composer.

Redirect you server towards app/index.html and run `composer install`.

You also need to add an .env file inside app/php_scripts with the API keys.

```
PURPLEAIR_API_KEY="XXXXX" 
ATMOSUD_API_KEY="XXXXX"
```

## Sensors

The app will get air quality data from multiples sensors and their API.

* Nebulo from AirCarto
* Purple Air
* Sensor Community
* AtmoSud


 ## Deploy



