<?php

$timespan = $_GET['timespan'];

$api_key_purple = $_GET['key'];


switch ($timespan) {
    case 2:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm1.0,pm2.5,pm10.0,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
        break;
    case 15:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_10minute,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
        break;
    case 60:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_60minute,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
        break;
    case 1440:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_24hour,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
        break;
}

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;