import express from 'express';
import bodyParser from 'body-parser'

import {usersJSON, ratingsJSON} from './data/data';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function simEuc(userID) {
  let user = usersJSON.filter(a => a.UserID == userID)
  let userMovies = ratingsJSON.filter(a => a.UserID == userID)

  /**  Sort list*/
  user.getSummary = function () {
    let summary = []
    for (let user of this.results) {
      summary.push([user.compareObject.UserName, user.getUsersInv()])
    }
    // return summary
  }
  
  // Results of eucscores
  user.results = []

  // 
  for (let userB of usersJSON) {
    let eucObj = {
      compareObject: userB,
      sumOfSquaredEuclidean: 0,
      euclideanResults: [],
      data: {
        method: "Peason Correlation Score",
        sum1: 0,
        sum2: 0,
        sum1sq: 0,
        sum2sq: 0,
        pSum: 0

        getSum1sq() {
          return (this.sum1)**2
        },
        getSum2sq() {
          return (this.sum2)**2
        },
        getPsum () {
          return
        }
      },
      getUsersInv() { return 1 / (1 + this.sumOfSquaredEuclidean)} // sqrt this ???
    }
    // totalMoviesRated: this.totalMoviesRated += 1,
    //         sum1: this.sum1 += movieA.Rating,
    //         sum2: this.sum2 += movieB.Rating,
    for (let movieB of ratingsJSON) {
      for (let movieA of userMovies) {
        /** 
         * Users have rated the same move and pushes an object with results to the results array
        */
        this.data.totalMoviesRated = this.totalMoviesRated += 1
        this.data.sum1 = this.sum1 += movieA.Rating
        this.data.sum2 = this.sum2 += movieB.Rating

        // Euclidean Calc
        if (userB.UserID == movieB.UserID && movieB.Movie == movieA.Movie) {
          let resultObj = {
            movie: movieA.Movie,
            eculideanScore: ((movieA.Rating - movieB.Rating)**2),
            
          }
          eucObj.sumOfSquaredEuclidean += ((movieA.Rating - movieB.Rating)**2)
          eucObj.euclideanResults.push(resultObj)
        }
      }
    }
    user.results.push(eucObj)
  } // User loop ends

  if (!user.results) {
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
});

app.get('/api/ratings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let userIDObj = simEuc(id)
  console.log(userIDObj.UserName);
  
  res.status(200).send({
    statusCode: 200,
    user: userIDObj,
    //user: usersJSON.filter(a => a.UserID == id),
    //ratedMovies: ratingsJSON.filter(a => a.UserID == id),
    euclideanScoreComparisons: userIDObj.getSummary() 
  });
});

app.get('/api/users', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'ratings reterived sucessfully',
    ratings: usersJSON
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});