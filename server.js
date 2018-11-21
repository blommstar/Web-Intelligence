let express = require('express')
let data = require('./data')
let euclidean = require('./euclidean')
let pearson = require('./pearson')
let ScoreGenerator = require('./weightedScore')
let Tabulator = require('tabulator-tables')

let app = express()

app.use(express.static('public'))

let scores = new ScoreGenerator()
scores.getAllResults()
// console.log(scores.results)

app.get('/results', (req, res, next) => { // /results
  res.send(scores.results)
  // res.send(data.users)
})

app.get('/results/:id', (req, res, next) => { // /results
  let cacheScore = scores
  const id = parseInt(req.params.id, 10)
  for (let user of data.users) {
    for (let obj of cacheScore.results) {
      if (user.UserID == id) {
        console.log(obj.movie.Movie)

        // for (let movie of obj.movie) {
        //   console.log([movie.Movie, obj.euclideanScore])
        // }
      }
    }
  }
  for (let obj of cacheScore.results) {
    if (obj.UserID == id) {
      console.log(obj)
    }
  }

  res.send(cacheScore.results[0].movie.Movie)
})

app.get('/users', (req, res, next) => {
  res.send(data.users)
})

app.get('/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  let mainUser
  for (let user of data.users) {
    if (user.UserID == id) {
      mainUser = user
    }
  }
  let euclideanResults = euclidean.checkAgainstAll(id)
  let pearsonResults = pearson.checkAgainstAll(id)
  res.send({
    user: mainUser,
    euclidean: euclideanResults,
    pearson: pearsonResults
  })
})

app.get('/ratings', (req, res, next) => {
  res.json(data.ratings)
})

app.get('/ratings/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  let movies = []

  for (let movie of data.ratings) {
    console.log(movie)
    if (Number(movie.UserID) == id) {
      for (let user of data.users) {
        if (Number(user.UserID) == id) {
          movies.push(movie)
        }
      }
    }
  }

  return res.json({
    movies: movies,
    id: id
  })
})

app.listen(5050, () => {
  console.log('Server running on port 5050')
})
