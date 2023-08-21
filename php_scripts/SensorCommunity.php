<?php

ini_set('user_agent', 'MyBrowser v42.0.4711');

$url = 'https://data.sensor.community/airrohr/v1/filter/box=44.034295,6.718140,42.589489,2.763062';

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
// header('User-Agent: Firefox');
echo $json_data;