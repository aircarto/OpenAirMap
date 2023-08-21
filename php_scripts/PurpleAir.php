<?php

use Dotenv\Dotenv;

require '../../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$api_key_purple = $_ENV['PURPLEAIR_API_KEY'];

$url = 'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm1.0,pm2.5,pm10.0,last_seen&api_key='.$api_key_purple.'&nwlng=5.223793027379755&nwlat=43.38349241945991&selng=5.594581567660924&selat=43.22158944480793';

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;