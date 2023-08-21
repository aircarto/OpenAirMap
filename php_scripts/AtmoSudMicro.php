<?php

$url = 'https://api.atmosud.org/observations/capteurs/mesures/dernieres?format=json&download=false&nb_dec=0';

//15 minutes seulement

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;