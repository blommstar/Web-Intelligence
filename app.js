import express from 'express'
import bodyParser from 'body-parser'

import { usersJSON, ratingsJSON } from './data/data'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

function simEuc (userID) {
  let user = usersJSON.filter(a => a.UserID == userID)
  let userMovies = ratingsJSON.filter(a => a.UserID == userID)

  /**  Sort list */
  user.getSummary = function () {
    let summary = []
    for (let user of this.results) {
      summary.push([user.compareObject.UserName, user.getUsersInv()])
    }
    summary.shift() // removers user (index 0 in the array)
    return summary.sort((a, b) => a[1] < b[1])
  }

  // Results of eucscores
  user.results = []
  user.PCSResults = []

  //
  for (let userB of usersJSON) {
    let pearsonObject = {
      method: 'Peason Correlation Score',
      sum1: 0,
      sum2: 0,
      sum1sq: 0,
      sum2sq: 0,
      pSum: 0,
      data: [],
      totalMoviesRated: 0,
      getPCS () {
        let num = this.pSum - (this.sum1 * this.sum2 / this.totalMoviesRated)
        let den = Math.sqrt()
      }
    }

    let eucObj = { //
      compareObject: userB,
      sumOfSquaredEuclidean: 0,
      euclideanResults: [],

      getUsersInv () { return 1 / (1 + this.sumOfSquaredEuclidean) } // sqrt this ???
    }

    // totalMoviesRated: this.totalMoviesRated += 1,
    //         sum1: this.sum1 += movieA.Rating,
    //         sum2: this.sum2 += movieB.Rating,
    for (let movieB of ratingsJSON) {
      for (let movieA of userMovies) {
        /**
         * Users have rated the same move and pushes an object with results to the results array
        */

        // Euclidean Calc
        if (userB.UserID == movieB.UserID && movieB.Movie == movieA.Movie) {
          // pearson calc
          pearsonObject.totalMoviesRated += 1
          pearsonObject.sum1 += Number(movieA.Rating)
          pearsonObject.sum2 += Number(movieB.Rating)
          pearsonObject.sum1sq += Number(movieA.Rating) ** 2
          pearsonObject.sum2sq += Number(movieB.Rating) ** 2
          pearsonObject.pSum += Number(movieA.Rating) * Number(movieB.Rating)
          let resultObj = {
            movie: movieA.Movie,
            eculideanScore: ((movieA.Rating - movieB.Rating) ** 2)

          }
          eucObj.sumOfSquaredEuclidean += ((movieA.Rating - movieB.Rating) ** 2)
          eucObj.euclideanResults.push(resultObj)
        }
      }
    }
    user.results.push(eucObj)
    user.PCSResults.push(pearsonObject)
  } // User loop ends
  console.log(user)

  if (user.results.length == 0 && user.PCSResults.length == 0) {
    console.log('No matched found')
    return 0
  }

  return user
}

/**
 * Routing
*/
app.get('/api/ratings', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'ratings reterived sucessfully',
    ratings: ratingsJSON
  })
})

app.get('/api/ratings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  let userIDObj = simEuc(id)
  console.log(userIDObj.getSummary())

  res.status(200).send({
    // test: userIDObj.results,
    statusCode: 200,
    // user: userIDObj,
    user: usersJSON.filter(a => a.UserID == id),
    // ratedMovies: ratingsJSON.filter(a => a.UserID == id),
    euclideanScoreComparisons: userIDObj.getSummary()
  })
})

app.get('/api/users', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'ratings reterived sucessfully',
    ratings: usersJSON
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
