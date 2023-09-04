<?php

$id_site = $_GET['id_site'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 
$timespan = $_GET['fin'];

switch ($timespan) {  
    case 2:
        exit;
        break; 
    case 15:
        break;
    case 60:
        break;
    case 1440:
        break;
}

$url = 'https://api.atmosud.org/observations/capteurs/mesures?debut='.$debut.'&fin='.$fin.'&id_site='.$id_site.'&format=json&download=false&nb_dec=0&variable=PM1%2CPM10%2CPM2.5';

//https://api.atmosud.org/observations/stations/mesures?nom_polluant=pm10%2Cpm2.5%2Cpm1&station_id=FR03029&date_debut=2023-08-01T19%3A19%3A30%2B0000&date_fin=2023-08-04T19%3A19%3A30%2B0000&temporalite=horaire&metadata=false&format=json&download=false

// //15 /60 /1440

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;