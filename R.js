const data = require('./data')

class R {
  constructor (userA) {
    this.userA = userA || { UserName: 'Lisa', UserID: '1' }
    this.users = data.users
    this.ratings = data.ratings
    this.meta = []
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
    let onlyMovies = []
    for (let user of this.users) {
      let obj = {
        user: user.UserName,
        euclidean: this.euclidean(this.userA, user),
        moviesWeighted: []
      }
      for (let movie of this.ratings) {
        if (movie.UserID == user.UserID) {
          obj.moviesWeighted.push({ movieName: movie.Movie, weightedScore: (movie.Rating * obj.euclidean) })
          onlyMovies.push({ movieName: movie.Movie, weightedScore: (movie.Rating * obj.euclidean) })
        }
      }
      results.push(obj)
    }
    this.meta = results
    return onlyMovies
  }

  getRecommended () {
    let data = this.weightedScore()

    // Get userA movies
    let userAMovies = this.ratings.filter(a => a.UserID == this.userA.UserID)

    // let results = userAMovies.map((curr, i, arr) => {
    //   let obj = {
    //     movie: curr.Movie,
    //     sum: data.reduce((a, c) => {
    //       if (curr.Movie == c.movieName) {
    //         return a + c.weightedScore
    //       }
    //       return a
    //     }, 0),
    //     sim: this.meta.reduce((a, c, i, arr) => {
    //       // console.log(curr.weightedScore)

    //       for (let mov of Array.from(c.moviesWeighted)) {
    //         if (mov.movieName == curr.Movie) {
    //           return a + c.euclidean
    //         }
    //       }
    //       return a
    //     }, 0)
    //   }
    //   obj.total = (obj.sum / obj.sim)
    //   return obj
    // })

    let results = userAMovies.map((curr, i, arr) => {
      let obj = {
        movie: curr.Movie,
        sum: 0,
        sim: 0
      }
      let reducer = this.meta.reduce((a, c, i, arr) => {
        // console.log(curr.weightedScore)

        for (let mov of Array.from(c.moviesWeighted)) {
          if (mov.movieName == curr.Movie) {
            obj.sum += mov.weightedScore
            obj.sim += c.euclidean
            // return a + c.euclidean
          }
        }
        return a
      }, 0)

      obj.total = (obj.sum / obj.sim)
      return obj
    })

    return results.sort((a, b) => a.total - b.total).reverse()
    // console.log(results)

    // console.log(userAMovies)

    // match score against movie and add all together
    // for (let obj of data) {
    //   let resObj = {}
    //   resObj.movie = ''
    //   resObj.sum = 0
    //   for (let movie of Array.from(obj.moviesWeighted)) {
    //     resObj.movie = movie.movieName
    //     for (let uAMovie of userAMovies) {
    //       if (uAMovie.Movie == movie.movieName) {
    //         resObj.sum += movie.weightedScore
    //       }
    //     }
    //   }
    //   results.push(resObj)
    //   return results
    // }

    // Sum weighted score for each movie
    // for (let movie of this.ratings) { // Movie loop
    //   let sumWeight = 0
    //   if (movie.Movie == this.userA.Movie) {

    //   }

    // let movObj = {
    //   movie: movie.Movie,
    //   sumOfAllWeighted: 0,
    //   sumOfAllSimScores: 0,
    //   total: 0
    // }

    // for (let user of data) {
    //   let movies = Array.from(user.moviesWeighted)
    //   for (let ratedMovie of movies) {
    //     if (movie.Movie == ratedMovie.movieName) {
    //       movObj.sumOfAllWeighted += ratedMovie.weightedScore
    //     }
    //   }
    //   movObj.sumOfAllSimScores += user.euclidean
    // }
    // movObj.total = movObj.sumOfAllWeighted / movObj.sumOfAllSimScores
    // recommendationData.push(movObj)
    // }

    // return recommendationData
  }
}

module.exports = R
// let aa = new R()
// console.log(aa.getRecommended())
