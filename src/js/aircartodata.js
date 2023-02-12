import 'whatwg-fetch'

// https://moduleair.fr/devices/API/nebulo_lastMeasure.php

let Nebulodata = {
    
    getData: async function (URL) {
         
    console.log(URL);
    
    // var dataOut = {"PM10":[],"PM25":[],"PM1":[]};
    // var feature = {"type": "Feature","id":"","properties":{},"geometry": {"type": "Point","coordinates": []}};

    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
        console.log('successful retrieved data');
        console.log(json);
        
        // dataOut.PM10 = json.features.filter(o=>o.properties.nom_poll == "PM10")
        // dataOut.PM25 = json.features.filter(o=>o.properties.nom_poll == "PM2.5")

        return json;
    })
}
}

export default Nebulodata
