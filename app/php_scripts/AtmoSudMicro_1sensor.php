<?php

$id_site = $_GET['id_site'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 

//$url = 'https://api.atmosud.org/observations/capteurs/mesures?debut=' + $debut + '&fin=' + $fin + '&id_site=' + $id_site + '&format=json&download=false&nb_dec=0&variable=PM1%2CPM10%2CPM2.5';
$url = 'https://api.atmosud.org/observations/capteurs/mesures?debut='.$debut.'&fin='.$fin.'&id_site='.$id_site.'&format=json&download=false&nb_dec=0&variable=PM1%2CPM10%2CPM2.5';

// $url = 'https://api.atmosud.org/observations/capteurs/mesures?debut=2023-08-27T21%3A40%3A39.356Z&fin=2023-08-28T21%3A40%3A39.356Z&id_site='.$id_site.'&format=json&download=false&nb_dec=0&variable=PM1%2CPM10%2CPM2.5';

// //15 minutes seulement

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;