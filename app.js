// server-express.js
const express = require('express')
const path = require('path');

const app = express() // initialize app
const port = 3000

app.use(express.static(path.join(__dirname, 'app')));

app.get('/', (req, res) => {
    res.redirect('index.html');
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})