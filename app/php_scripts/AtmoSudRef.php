<?php

// VIENS Chercher les mesures dernieres

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

$url =  'https://api.atmosud.org/observations/stations/mesures/derniere?nom_polluant=pm10%2Cpm2.5%2Cpm1&temporalite='.$temporalite.'&metadata=false&format=json&download=false';


$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;