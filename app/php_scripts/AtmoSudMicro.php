<?php

$url = 'https://api.atmosud.org/observations/capteurs/mesures/dernieres?format=json&download=false&nb_dec=0&variable=PM10%2CPM2.5%2CPM1&delais=1440';

//15 minutes seulement

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;