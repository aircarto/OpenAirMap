<?php

$id_site = $_GET['id_site'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 
$timespan = $_GET['timespan'];


$url = 'https://api.atmosud.org/observations/capteurs/mesures?'.
'debut='.$debut.
'&fin='.$fin.
'&id_site='.$id_site.
'&format=json'.
'&download=false'.
'&nb_dec=0'.
'&variable=PM1%2CPM10%2CPM2.5';

switch ($timespan) {  
    case 2:
        exit;
        break; 
    case 15:
        $url .= '&aggregation=quart-horaire';
        $url .= '&valeur_brute=true';
        break;
    case 60:
        $url .= '&aggregation=horaire';
        $url .= '&valeur_brute=true';
        break;
    case 1440:
        exit;
        break; 
}

// //15 minutes seulement

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;