const data = require('./data')

class R {
  constructor (userA) {
    this.userA = userA || { UserName: 'Lisa', UserID: '1' }
    this.users = data.users
    this.ratings = data.ratings
    this.recommendationData = this.getRecommended()
  }

  euclidean (userA, userB) {
    let simScore = 0
    for (let movieA of this.ratings) {
      if (movieA.UserID == userA.UserID) {
        for (let movieB of this.ratings) {
          if (movieB.UserID == userB.UserID) { // If both have rated the movie
            simScore += ((movieA.Rating - movieB.Rating) ** 2)
          }
        }
      }
    }
    return 1 / (1 + Math.sqrt(simScore))
  }

  weightedScore () {
    let results = []
    for (let user of this.users) {
      if (this.userA.UserID == user.UserID) {
        continue
      }
      let obj = {
        user: user.UserName,
        euclidean: this.euclidean(this.userA, user),
        moviesWeighted: []
      }
      for (let movie of this.ratings) {
        if (movie.UserID == user.UserID) {
          obj.moviesWeighted.push({ movieName: movie.Movie, weightedScore: (movie.Rating * obj.euclidean) })
        }
      }
      results.push(obj)
    }
    return results
  }

  getRecommended () {
    let data = this.weightedScore()
    let recommendationData = []
    // Sum weighted score for each movie
    for (let movie of this.ratings) { // Movie loop
      let movObj = {
        movie: movie.Movie,
        sumOfAllWeighted: 0,
        sumOfAllSimScores: 0,
        total: 0
      }
      for (let user of data) {
        let movies = Array.from(user.moviesWeighted)
        for (let ratedMovie of movies) {
          if (movie.Movie == ratedMovie.movieName) {
            movObj.sumOfAllWeighted += ratedMovie.weightedScore
          }
        }
        movObj.sumOfAllSimScores += user.euclidean
      }
      movObj.total = movObj.sumOfAllWeighted / movObj.sumOfAllSimScores
      recommendationData.push(movObj)
    }

    return recommendationData
  }
  bestMatches () {
    let data = this.recommendationData
    // data.sort((a, b) => a.total - b.total)
    let merged = []

    for (let movie of data) {

    }

    if (merged.length == 0) {
      merged.push(data[0])
    }

    for (let mov of merged) {
      if (movie.movie == mov.movie) {
        // mov.movie = movie.movie
        mov.sumOfAllWeighted += movie.sumOfAllWeighted
        mov.sumOfAllSimScores += movie.sumOfAllSimScores
        mov.total += movie.total
      } else {
        merged.push(movie)
      }
      break
    }
    console.log(merged)
  }
}

let aa = new R()
aa.bestMatches()
