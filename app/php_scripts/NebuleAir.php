<?php

$url = 'https://moduleair.fr/devices/API/nebuleAir_lastMeasure.php';

$json_data = file_get_contents($url);

echo $json_data;



