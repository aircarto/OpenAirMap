<?php

$url = 'https://api.atmosud.org/observations/stations/mesures/derniere?nom_polluant=PM10%2CPM2.5%2CPM1&temporalite=quart-horaire&metadata=false&only_validate_values=false&format=json&download=false';

// https://api.atmosud.org/observations/stations/mesures/derniere?temporalite=quart-horaire&metadata=false&format=json&download=false

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;