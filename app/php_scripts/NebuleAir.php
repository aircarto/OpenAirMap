<?php

$url = 'https://aircarto.fr/API/nebuleAir/lastMeasure.php';

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;