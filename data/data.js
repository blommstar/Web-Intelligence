const fs = require('fs')
const papa = require('papaparse')

// let users = fs.readFileSync('./users.csv', 'utf8')
// let ratings = fs.readFileSync('./ratings.csv', 'utf8')

let usersJSON = papa.parse(fs.readFileSync('./users.csv', 'utf8'), { header: true }).data
let ratingsJSON = papa.parse(fs.readFileSync('./ratings.csv', 'utf8'), { header: true }).data

export { usersJSON, ratingsJSON }
