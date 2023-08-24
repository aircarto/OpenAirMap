<?php

$timespan = $_GET['timespan']; 

switch ($timespan) {
    case 2:
        $url = 'https://aircarto.fr/API/nebuleAir/lastMeasure_new.php';
        break;
    case 15:
        $url = 'https://aircarto.fr/API/nebuleAir/lastMeasure_new.php';
        break;
    case 60:
        $url = 'https://aircarto.fr/API/nebuleAir/lastMeasure_new.php';
        break;
    case 1440:
        $url = 'https://aircarto.fr/API/nebuleAir/lastMeasure_new.php';
        break;
}

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;
