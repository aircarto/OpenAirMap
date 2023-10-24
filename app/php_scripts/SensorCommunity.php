<?php

ini_set('user_agent', 'MyBrowser v42.0.4711');

// $url = 'https://data.sensor.community/airrohr/v1/filter/box=45.22,7.83,42.91,4.16';

$url = 'https://data.sensor.community/airrohr/v1/filter/country=FR';

// 42.629917,2.043457,45.494796,9.953613
// westlimit=4.16; southlimit=43.02; eastlimit=7.83; northlimit=45.22
// 4.16,42.91,7.83,45.22

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
// header('User-Agent: Firefox');
echo $json_data;