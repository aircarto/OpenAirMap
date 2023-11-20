<?php

require '../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable('../');
$dotenv->load();

$timespan = $_GET['timespan'];

//$api_key_purple = $_GET['key'];
$api_key_purple = $_ENV['PURPLEAIR_API_KEY'];


// switch ($timespan) {
//     case 2:
//         $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm1.0,pm2.5,pm10.0,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
//         break;
//     case 15:
//         $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_10minute,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
//         break;
//     case 60:
//         $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_60minute,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
//         break;
//     case 1440:
//         $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_24hour,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';
//         break;
// }

// (-54.5247541978, 2.05338918702, 9.56001631027, 51.1485061713))


switch ($timespan) {
    case 2:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm1.0,pm2.5,pm10.0,last_seen&api_key='.$api_key_purple.'&location_type=0&nwlng=-5.523&nwlat=50.990&selng=7.298&selat=42.143';
        break;
    case 15:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_10minute,last_seen&api_key='.$api_key_purple.'&location_type=0&nwlng=-5.523&nwlat=50.990&selng=7.298&selat=42.143';
        break;
    case 60:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_60minute,last_seen&api_key='.$api_key_purple.'&location_type=0&nwlng=-5.523&nwlat=50.990&selng=7.298&selat=42.143';
        break;
    case 1440:
        $url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5_24hour,last_seen&api_key='.$api_key_purple.'&location_type=0&nwlng=-5.523&nwlat=50.990&selng=7.298&selat=42.143';
        break;
}

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;