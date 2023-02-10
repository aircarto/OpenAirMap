// server-express.js
const express = require('express')
const path = require('path');

const app = express() // initialize app
const port = 3003

app.use(express.static(path.join(__dirname, 'app')));

require('dotenv').config()
console.log("Purple Air API: ", process.env.purpleAir_API_key)

//TODO: send API key to js files

app.get('/', (req, res) => {
    res.redirect('index.html');
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})