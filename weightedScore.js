
const data = require('./data')
const euc = require('./euclidean')
const peasron = require('./pearson')

function ws (ratingsArr, usersArr, subjectsUserID) {
  matched
  for (let movie of ratingsArr) {
    if (movie.userID != subjectsUserID) {

    }
  }
}

class ScoreGenerator {
  constructor (datay) {
    this.ratingsArr = datay || data.ratings
    this.usersArr = datay || data.users
    // this.results = {}
    this.results = []
  }

  getED (userA, userB) {
    let ratings = this.ratingsArr
    let users = this.usersArr
    let userARatedMovies = []
    let userBRatedMovies = []

    let totalSim = 0
    let userAData = []

    for (let movie of ratings) {
      // If movie is rated by userA
      if (movie.UserID == userA.UserID) {
        userARatedMovies.push(movie)
      }
      // If movie is rated by userA
      if (movie.UserID == userB.UserID) {
        userBRatedMovies.push(movie)
      }
    }

    for (let ratedByA of userARatedMovies) {
      for (let ratedByB of userBRatedMovies) {
        // If they have rated the same move - perform Euclidean calculation
        if (ratedByA.Movie == ratedByB.Movie) {
          let eucScore = (ratedByA.Rating - ratedByB.Rating) ** 2
          totalSim += eucScore
          let scoreObj = {
            movie: ratedByA,
            userB: userB.UserName,
            euclideanScore: eucScore
          }
          userAData.push(scoreObj)
        }
      }
    }
    let inv = 1 / (1 + totalSim)

    // Meta added
    // userAData.unshift({ user: userA, compareSubject: userB, SimilarityScore: inv })
    // userAData.unshift(userA)
    this.results.push({ user: userA, compareSubject: userB, SimilarityScore: inv })
    this.results.push(userAData)
    // om arr
    // if (!this.results[userA.UserID]) {
    //   this.results[userA.UserID] = []
    // }
    // this.results[userA.UserID].push(userAData)
    return this
  }

  getPCS () {

  }

  getAllResults (userID) {
    let userResults = []
    for (let userA of this.usersArr) {
      // If statement to filter argument user ***
      if (userA.UserID == userID) {
        for (let userB of this.usersArr) {
          let userAED = this.getED(userA, userB).results
          let popedUserA = userAED.shift()
          // Find all rated movies by user B andmultiply by similartyScore given by getED ***
          // console.log(userA, userB)
          let euc = {}
          euc = {
            // findRecommendationFor: userA.UserName,
            otherUser: userB.UserName,
            simScoreEuc: popedUserA.SimilarityScore
          }

          userResults.push(euc)
        }
      }
    }
    console.dir(userResults)
  }
}

let aa = new ScoreGenerator()

aa.getAllResults(1)

// console.log(aa.results)

module.exports = ScoreGenerator

// export { ScoreGenerator }
