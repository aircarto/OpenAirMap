import 'whatwg-fetch'

let AtmoSuddata = {
    
    getData: async function (URL) {
         
    console.log(URL);
    
    return fetch(URL)
			.then((resp) => resp.json())
			.then((json) => {
        console.log('successful retrieved data');
        return json;
    })
}
}

export default AtmoSuddata
