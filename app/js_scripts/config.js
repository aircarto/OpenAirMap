var options = {
	"coordsCenter": [43.29490421, 5.37188392],
	"zoomLevel": 15,
	"minZoom": 1,
	"maxZoom": 21,
	"compoundUpper": "PM25",
	"timespanLower": 60,   //pas de temps de base 2min, 15min, 60min ou journéé (??)
	"timeLength": 24,      // ???
	"display": "atmosudmicro, nebuleair",
	//"display":"nebuleair,sensorcommunity,atmosudmicro",
	// "boundSW" : [42.91,4.16],
	// "boundNE" : [45.22,7.83]

	"boundSW": [-90, -180],
	"boundNE": [90, 180]

	// [[-90,-180],   [90,180]]
	// Tiles
	// "tiles": "https://{s}.maps.sensor.community/tiles/{z}/{x}/{y}.png",
	// "tiles_path": "/{z}/{x}/{y}.png",
	// "tiles_subdomains": ["osmc1","osmc2","osmc3"],
	// "attribution": "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
}

// [45.22,7.83],[42.91,4.16]