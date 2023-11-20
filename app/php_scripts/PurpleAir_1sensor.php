<?php

require '../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable('../');
$dotenv->load();

$id = $_GET['id'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 
$timespan = $_GET['timespan'];
//$api_key_purple = $_GET['key'];
$api_key_purple = $_ENV['PURPLEAIR_API_KEY'];


switch ($timespan) {  
    case 2:
        $timespan = '2m';
        break; 
    case 15:
        $timespan = '15m';
        break;
    case 60:
        $timespan = '1h';
        break;
    case 1440:
        $timespan = '1d';
        break;
}

$url = 'https://aircarto.fr/API_V2/capteurs/dataNebuleAir?capteurID=nebuleair-'.$id.'&start='.$debut.'&end='.$fin.'&freq='.$timespan;

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;