function loadModelisationPMAtmo() {  //Normalement h24 pour heure actuelle.

  //https://api.atmosud.org/prevision/cartes/horaires/liste

  modelisationPMAtmoSud.clearLayers();

  switch (compoundUpper) {
    case 'PM1':
      var string_layer = 'paca_pm1_h24';
      openToast("Pas de modélisation AtmoSud pour les PM1");
      break;
    case 'PM25':
      var string_layer = 'paca_pm2_5_h24';
      new L.tileLayer.wms('https://azurh-geoservices.atmosud.org/geoserver/azur_heure/ows', {
        version: '1.1.1',
        layers: string_layer,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true,
        opacity: 0.6
      }).addTo(modelisationPMAtmoSud);;
      break;
    case 'PM10':
      var string_layer = 'paca_pm10_h24';
      new L.tileLayer.wms('https://azurh-geoservices.atmosud.org/geoserver/azur_heure/ows', {
        version: '1.1.1',
        layers: string_layer,
        format: 'image/png',
        crs: L.CRS.EPSG4326,
        transparent: true,
        opacity: 0.6
      }).addTo(modelisationPMAtmoSud);;
      break;
  }

}

function loadModelisationICAIRAtmo() {

  //https://api.atmosud.org/prevision/cartes/horaires/liste

  modelisationICAIRAtmoSud.clearLayers();

  new L.tileLayer.wms('https://azurh-geoservices.atmosud.org/geoserver/azur_heure/ows', {
    version: '1.1.1',
    layers: 'paca_icairh_h24',
    format: 'image/png',
    crs: L.CRS.EPSG4326,
    transparent: true,
    opacity: 0.6
  }).addTo(modelisationICAIRAtmoSud);;

}

function switchModelisationPMAtmo() {
  if (
    document.querySelector("#checkbox_modelisationPMAtmoSud").checked &&
    timespanLower != 1440
  ) {
    loadModelisationPMAtmo();
    map.addLayer(modelisationPMAtmoSud);
  } else {
    if (modelisationPMAtmoSud != undefined) {
      map.removeLayer(modelisationPMAtmoSud);
    }
    if (timespanLower == 1440) {
      openToast(
        "La modélisation des particules fines présente des observations horaires."
      );
    }
    document.querySelector(
      "#checkbox_modelisationPMAtmoSud"
    ).checked = false;
  }
}

function switchModelisationICAIRAtmo() {
  if (
    document.querySelector("#checkbox_modelisationICAIRAtmoSud")
      .checked &&
    timespanLower != 1440
  ) {
    loadModelisationICAIRAtmo();
    map.addLayer(modelisationICAIRAtmoSud);
  } else {
    if (modelisationICAIRAtmoSud != undefined) {
      map.removeLayer(modelisationICAIRAtmoSud);
    }
    if (timespanLower == 1440) {
      openToast(
        "La modélisation ICAIRh présente des observations horaires."
      );
    }
    document.querySelector(
      "#checkbox_modelisationICAIRAtmoSud"
    ).checked = false;
  }
}
