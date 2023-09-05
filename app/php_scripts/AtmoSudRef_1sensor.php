<?php

$id_site = $_GET['id_site'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 
$timespan = $_GET['timespan'];

switch ($timespan) {  
    case 2:
        exit;
        break; 
    case 15:
        $temporalite = 'quart-horaire';
        break;
    case 60:
        $temporalite = 'horaire';
        break;
    case 1440:
        $temporalite = 'journalière';
        break;
}

$url =  'https://api.atmosud.org/observations/stations/mesures?nom_polluant=pm10%2Cpm2.5%2Cpm1&station_id='.$id_site.'&date_debut='.$debut.'&date_fin='.$fin.'&temporalite='.$temporalite.'&metadata=false&format=json&download=false';

//https://api.atmosud.org/observations/stations/mesures?nom_polluant=pm10%2Cpm2.5%2Cpm1&station_id=FR00041&date_debut=2023-09-05T05:07:02.678Z&date_fin=2023-09-05T06:07:02.678Z&temporalite=horaire&metadata=false&format=json&download=false

// //15 /60 /1440

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;