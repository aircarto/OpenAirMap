# OpenAirMap dev

![mapImage](app/img/example_OpenAirMap.jpg)

Map of all outdoors air quality sensors in southern France.

Project developped with [AirCarto](https://www.aircarto.fr) and [AtmoSud](https://www.atmosud.org/).


## Deploy

To deploy the app you need a Apache web server (Nginx is still tested) with the last version of PHP and composer.

Redirect you server towards app/index.html and run `composer install`.

You also need to add an `.env` file inside app/php_scripts with the API keys.

```
PURPLEAIR_API_KEY="XXXXX" 
ATMOSUD_API_KEY="XXXXX"
```

You can get your Purple Air API Key here [PurpleAir Develop](https://community.purpleair.com/t/making-api-calls-with-the-purpleair-api/180). Attention PurpleAir data is no more free, you need to pay to have data credit.

You can get your AtmoSud API Key here [API AtmoSud](https://api.atmosud.org/register/form).

Attention: to ensure the security of the .env file you should verify that it is not accessible from a client side browser. 

The .htaccess should prevent access for Apache server but you need to set AllowOverride to "All" inside your Apache configuration file (apache2.conf):

```
<Directory /var/www/>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

## Sensors

The app will get air quality data from multiples sensors and their API.

* Nebulo from AirCarto
* Purple Air
* Sensor Community
* AtmoSud



