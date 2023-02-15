import _ from 'lodash'
import 'whatwg-fetch'

//https://data.sensor.community/airrohr/v1/filter/box=43.439306,5.629051,43.13605,5.161638


let api = {
	pm_sensors: {
		"SDS011": true,
		"SDS021": true,
		"PMS1003": true,
		"PMS3003": true,
		"PMS5003": true,
		"PMS6003": true,
		"PMS7003": true,
		"HPM": true,
		"SPS30": true,
		"NextPM": true,
		"IPS-7100": true
	},
	checkValues(obj, sel) {
		let result = false;
		if (obj !== undefined && typeof (obj) === 'number' && !isNaN(obj)) {
			if ((sel === "PM10") && (obj < 1900)) {
				result = true;
			} else if ((sel === "PM25") && (obj < 900)) {
				result = true;
			} else if ((sel === "PM1") && (obj < 900)) {
				result = true;
			}
		}
		return result;
	},
	/* fetches from /now, ignores non-finedust sensors
	now returns data from last 5 minutes, so we group all data by sensorId
	 and compute a mean to get distinct values per sensor */
	getData: async function (URL, num) {
        
        console.log(URL);

		function getRightValue(array, type) {
            let value;
            array.forEach(item => (item.value_type === type) ? value = item.value : null);

			if(typeof value === 'undefined'){
				value = "-1";
			}
            return value;
        }

		return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
				console.log('successful retrieved data');
				let timestamp_data = '';
				let timestamp_from = '';

				if (num === 1) {
					let sensors = _.chain(json)
						.filter((sensor) =>
							typeof api.pm_sensors[sensor.sensor.sensor_type.name] != "undefined"
							&& api.pm_sensors[sensor.sensor.sensor_type.name]
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P1")), "PM10")
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P2")), "PM25")
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P0")), "PM1")
						)
						.map((values) => {
							if (values.timestamp > timestamp_data) {
								timestamp_data = values.timestamp;
								timestamp_from = "Marseille";
							}
							return {
								data: {
									PM10: parseInt(getRightValue(values.sensordatavalues, "P1")),
									PM25: parseInt(getRightValue(values.sensordatavalues, "P2")),
									PM1: parseInt(getRightValue(values.sensordatavalues, "P0"))
								},
								id: values.sensor.id,
								latitude: Number(values.location.latitude),
								longitude: Number(values.location.longitude),
								"indoor": values.location.indoor,
							}
						})
						.value();

					// Filter unique sensors

					var cells = Object.values(
						sensors.reduce( (c, e) => {
						  if (!c[e.id]) c[e.id] = e;
						  return c;
						}, {})
					  );

					return Promise.resolve({cells: cells, timestamp: timestamp_data, timestamp_from: timestamp_from});
				} else if (num === 2){
					let cells = _.chain(json)
						.filter((sensor) =>
							typeof api.pm_sensors[sensor.sensor.sensor_type.name] != "undefined"
							&& api.pm_sensors[sensor.sensor.sensor_type.name]
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P1")), "PM10")
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P2")), "PM25")
							&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P0")), "PM1")
						)
						.map((values) => {
							if (values.timestamp > timestamp_data) {
								timestamp_data = values.timestamp;
								timestamp_from = "current";
							}
							return {
								data: {
									PM10: parseInt(getRightValue(values.sensordatavalues, "P1")),
									PM25: parseInt(getRightValue(values.sensordatavalues, "P2")),
									PM1: parseInt(getRightValue(values.sensordatavalues, "P0"))
								},
								id: values.sensor.id,
								latitude: Number(values.location.latitude),
								longitude: Number(values.location.longitude),
								"indoor": values.location.indoor,
							}
						})
						.value();
					return Promise.resolve({cells: cells, timestamp: timestamp_data, timestamp_from: timestamp_from});
				}else if (num === 3) {
					let cells = _.chain(json)
					.filter((sensor) =>
						typeof api.pm_sensors[sensor.sensor.sensor_type.name] != "undefined"
						&& api.pm_sensors[sensor.sensor.sensor_type.name]
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P1")), "PM10")
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P2")), "PM25")
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P0")), "PM1")
					)
					.map((values) => {
						if (values.timestamp > timestamp_data) {
							timestamp_data = values.timestamp;
							timestamp_from = "hourly";
						}
						return {
							data: {
								PM10: parseInt(getRightValue(values.sensordatavalues, "P1")),
								PM25: parseInt(getRightValue(values.sensordatavalues, "P2")),
								PM1: parseInt(getRightValue(values.sensordatavalues, "P0"))
							},
							id: values.sensor.id,
							latitude: Number(values.location.latitude),
							longitude: Number(values.location.longitude),
							"indoor": values.location.indoor,
						}
					})
					.value();
				return Promise.resolve({cells: cells, timestamp: timestamp_data, timestamp_from: timestamp_from});
				} else if (num === 3) {
					let cells = _.chain(json)
					.filter((sensor) =>
						typeof api.pm_sensors[sensor.sensor.sensor_type.name] != "undefined"
						&& api.pm_sensors[sensor.sensor.sensor_type.name]
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P1")), "PM10")
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P2")), "PM25")
						&& api.checkValues(parseInt(getRightValue(sensor.sensordatavalues, "P0")), "PM1")
					)
					.map((values) => {
						if (values.timestamp > timestamp_data) {
							timestamp_data = values.timestamp;
							timestamp_from = "daily";
						}
						return {
							data: {
								PM10: parseInt(getRightValue(values.sensordatavalues, "P1")),
								PM25: parseInt(getRightValue(values.sensordatavalues, "P2")),
								PM1: parseInt(getRightValue(values.sensordatavalues, "P0"))
							},
							id: values.sensor.id,
							latitude: Number(values.location.latitude),
							longitude: Number(values.location.longitude),
							"indoor": values.location.indoor,
						}
					})
					.value();
				return Promise.resolve({cells: cells, timestamp: timestamp_data, timestamp_from: timestamp_from});
				}
			}).catch(function (error) {
				// If there is any error you will catch them here
				throw new Error(`Problems fetching data ${error}`)
			});
	}
};

export default api
