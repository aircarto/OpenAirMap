// server-express.js
const express = require('express')
const app = express() // initialize app
const port = 3000

// GET callback function returns a response message
app.get('/', (req, res) => {
res.send('Open Air Map plouf')
})

app.listen(port, () => {
console.log(`Server listening at http://localhost:${port}`)
})