let express = require('express')
let data = require('./data')
let euclidean = require('./euclidean')

let app = express()

app.use(express.static('public'))

app.get('/users', (req, res, next) => {
  res.send(data.users)
})

app.get('/ratings', (req, res, next) => {
  res.json(data.ratings)
})

app.listen(5050, () => {
  console.log('Server running on port 5050')
})
