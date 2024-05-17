<?php

/*
 URL pour récupérer la dernière data dispo des micro-stations sur l'API d'AtmoSud
 observations/capteurs/dernières
*/

$timespan = $_GET['timespan']; //les différents pas de temps: 2/15/60/1440 minutes


$url = 'https://api.atmosud.org/observations/capteurs/mesures/dernieres?'.
'format=json&'.
'download=false&'.
'nb_dec=1&'.
'type_capteur=true&'.
'variable=PM10%2CPM2.5%2CPM1&'.
//'id_site=303&'.
'delais=1440';


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


$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;