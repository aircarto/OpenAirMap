<?php

$timespan = $_GET['timespan']; 

switch ($timespan) {  
    case 2:
        exit;
        break; 
    case 15:
        $url = 'https://api.atmosud.org/observations/stations/mesures/derniere?nom_polluant=PM10%2CPM2.5%2CPM1&temporalite=quart-horaire&metadata=false&only_validate_values=false&format=json&download=false';
        break;
    case 60:
        $url = 'https://api.atmosud.org/observations/stations/mesures/derniere?nom_polluant=PM10%2CPM2.5%2CPM1&temporalite=horaire&metadata=false&only_validate_values=false&format=json&download=false';
        break;
    case 1440:
        $url = 'https://api.atmosud.org/observations/stations/mesures/derniere?nom_polluant=PM10%2CPM2.5%2CPM1&temporalite=journali%C3%A8re&metadata=false&only_validate_values=false&format=json&download=false';
        break;
}

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;