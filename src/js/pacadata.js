import 'whatwg-fetch'

let PACAdata = {
    
    getData: async function (URL) {
         
    console.log(URL);
    
    var dataOut = {"PM10":[],"PM25":[]};
    
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
            
        console.log('successful retrieved data');
        
        dataOut.PM10 = json.features.filter(o=>o.properties.nom_poll == "PM10")
        dataOut.PM25 = json.features.filter(o=>o.properties.nom_poll == "PM2.5")

        return dataOut;
    })
}
}

export default PACAdata
