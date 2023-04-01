module.exports = {
    "initialView": [43.296398, 5.370000],
    "initialZoom": 12,
    "minZoom": 8,
    "maxZoom": 16,
    "sensor": "PM25", // sensor shown at start, possible values: PM10, PM25, PM1
    "tiles_server": "https://{s}.maps.sensor.community",
    "tiles_path": "/{z}/{x}/{y}.png",
    "tiles_subdomains": ["osmc1", "osmc2", "osmc3"],
    "data_host": "https://maps.sensor.community",
    "attribution": "<a href='https://openstreetmap.org'>OpenStreetMap</a> | <a href='https://sensor.community/'>Sensor.Community</a>",
    "tableTitles": {
        "PM10": "PM10 &micro;g/m&sup3;",
        "PM25": "PM2.5 &micro;g/m&sup3;",
        "PM10eu": "PM10 &micro;g/m&sup3;",
        "PM25eu": "PM2.5 &micro;g/m&sup3;",
        "PM10who": "PM10 &micro;g/m&sup3;",
        "PM25who": "PM2.5 &micro;g/m&sup3;",
        "Temperature": "Temperature °C",
        "Humidity": "Humidity %",
        "Pressure": "Pressure hPa",
        "Noise": "Noise dBA",
        "AQIus": "AQI",
    },
    "panelIDs": {
        "PM10": [2, 1],
        "PM25": [2, 1],
        "PM1": [2, 1],
        "PM10eu": [2, 1],
        "PM25eu": [2, 1],
        "PM10who": [2, 1],
        "PM25who": [2, 1],
        "Temperature": [4, 3],
        "Humidity": [6, 5],
        "Pressure": [8, 7],
        "Noise": [0, 12]
    },
    "locale": {
        "dateTime": "%Y.%m.%d %H:%M:%S",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "shortDays": ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
        "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        "shortMonths": ["Jan.", "Feb.", "Mar.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."]
    },
    "scale_options": {
        "PM10": {
            valueDomain: [0, 20, 40, 60, 100, 500], colorRange: ['#00796B', '#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
        }, "PM25": {
            valueDomain: [0, 10, 20, 40, 60, 100], colorRange: ['#00796B', '#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
        }, "PM1": {
            valueDomain: [0, 10, 20, 40, 60, 100], colorRange: ['#00796B', '#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
        }
        
        // ,"PM10eu": {
        //     valueDomain: [10, 30, 45, 75, 125, 150], colorRange: ['#50F0E6', '#50CCAA', '#F0E641', '#FF5050', '#960032', '#7D2181']
        // }, "PM25eu": {
        //     valueDomain: [5, 15, 22.5, 37.5, 62.5, 75], colorRange: ['#50F0E6', '#50CCAA', '#F0E641', '#FF5050', '#960032', '#7D2181']
        // }
    }
}
