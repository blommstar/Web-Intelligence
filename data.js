const fs = require('fs')
const papa = require('papaparse')

let usersJSON = papa.parse(fs.readFileSync('./users.csv', 'utf8'), { header: true }).data
let ratingsJSON = papa.parse(fs.readFileSync('./ratings.csv', 'utf8'), { header: true }).data

module.exports = {
  users: usersJSON,
  ratings: ratingsJSON
}
