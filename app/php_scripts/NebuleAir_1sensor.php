<?php

$id = $_GET['id'];
$debut = $_GET['debut']; 
$fin = $_GET['fin']; 

$url = 'https://aircarto.fr/API_V2/capteurs/dataNebuleAir?capteurID=nebuleair-'.$id.'&start='.$debut.'&end='.$fin;

$json_data = file_get_contents($url);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
echo $json_data;