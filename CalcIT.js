const data = require('./data')

class R {
  constructor (userA) {
    this.userA = userA || { UserName: 'Toby', UserID: '7' }
    this.users = data.users
    this.ratings = data.ratings
    this.test = []
  }

  euclidean (userA, userB) {
    let sim = 0
    let i = 0
    let userAMovies = this.ratings.filter(a => a.UserID == userA.UserID)
    let userBMovies = this.ratings.filter(a => a.UserID == userB.UserID)

    for (let rA of userAMovies) {
      for (let rB of userBMovies) {
        if (rA.Movie == rB.Movie) {
          sim += (Number(rA.Rating) - Number(rB.Rating)) ** 2
        }
      }
    }

    if (sim == 0) {
      return 0
    }

    return 1 / (1 + sim)
    // return 1 / (1 + Math.sqrt(sim))
    // for (let movieA of this.ratings) {
    //   if (movieA.UserID == userA.UserID) {
    //     for (let movieB of this.ratings) {
    //       if (movieB.UserID == userB.UserID) { // If both have rated the movie
    //         simScore += ((movieA.Rating - movieB.Rating) ** 2)
    //       }
    //     }
    //   }
    // }

    // return 1 / (1 + Math.sqrt(simScore))
    // return 1 / Math.sqrt((1 + simScore))
  }

  weightedScore () { // användarens poäng gånger simScore
    for (let rating of this.ratings) {
      for (let userB of this.users) {
        userB.euclidean = this.euclidean(this.userA, userB)
        rating.weighted = rating.Rating * (this.euclidean(this.userA, userB))
      }
    }

    return this
    // for (let user of this.users) { // loopar användare
    //   let obj = {
    //     user: user.UserName,
    //     euclidean: this.euclidean(this.userA, user)
    //   }
    //   for (let movie of this.ratings) { // loopar filmer som är betygsatta
    //     if (movie.UserID == user.UserID) { // om loop-användaren har satt betyg på filmen
    //       onlyMovies.push({ movieName: movie.Movie, weightedScore: (movie.Rating * obj.euclidean), obj })
    //     }
    //   }
    // }
    // return onlyMovies
  }

  // getRec () { // Summera alla viktade
  //   let data = this.weightedScore()
  //   let results = []
  //   let userAMovies = this.ratings.filter(a => a.UserID == this.userA.UserID)
  //   for (let movie of userAMovies) { // 7 loops
  //     let obj = {}
  //     obj.sum = 0
  //     obj.sim = 0
  //     for (let movie2 of data) {
  //       if (movie.Movie == movie2.movieName) {
  //         obj.movie = movie.Movie
  //         obj.sum += Number(movie2.weightedScore)
  //         obj.sim += Number(movie2.obj.euclidean)
  //       }
  //     }
  //     obj.total = (obj.sum / obj.sim)
  //     results.push(obj)
  //   }
  //   return results.sort((a, b) => a.total - b.total).reverse()
  // }
  getRec () {
    let results = []
    let score = []
    // // Create an array of all movies
    let movies = this.ratings.map(a => a.Movie).filter((item, pos, arr) => arr.indexOf(item) == pos)

    for (let movie of movies) {
      let obj2 = {
        movie: movie,
        sum: this.ratings.reduce((acc, curr, i, arr) => {
          if (curr.Movie == movie) { // om filmen finns i ************************************************************
            console.log(curr)

            return acc + curr.weighted
          }
        }, 0),
        sim: this.ratings.reduce((acc, curr, i, arr) => {
          if (curr.Movie == movie) { // summan av simScore
            return acc + curr.euclidean
          }
        }, 0),
        getTotal () {
          return this.sum / this.sim
        }
      }
      this.test.push(obj2)
      let obj = {
        movie: movie,
        sum: 0,
        sim: 0,
        total: 0
      }
      for (let rating of this.ratings) {
        if (movie == rating.Movie) { // Kolla endast mor userA this.userA.UserID ???
          // obj.movie = rating.Movie
          for (let user of this.users) {
            obj.sim += this.euclidean(this.userA, user)
            obj.sum += Number(rating.Rating) * this.euclidean(this.userA, user) // Rating * euc
          }
        }
      }
      obj.total = (obj.sum / obj.sim)
      score.push([obj.movie, obj.total])
    }
    return score.sort((a, b) => a[1] - b[1]).reverse()
    //   for (let user of this.users) { // Looping users
    //     let obj = {
    //       movie: 'vafan',
    //       sum: 0,
    //       sim: 0,
    //       total: 0
    //     }
    //     for (let rating of this.ratings) { // rating
    //       if (user.UserID == rating.UserID) { // Kolla endast mor userA this.userA.UserID ???
    //         // obj.movie = rating.Movie
    //         obj.sum += Number(rating.Rating) * this.euclidean(this.userA, user) // Rating * euc
    //         obj.sim += this.euclidean(this.userA, user)
    //       }
    //     }
    //     obj.total = (obj.sum / obj.sim)
    //     score.push([obj.movie, obj.total])

  //     // results.push(obj)
  //   }
  //   return score.sort((a, b) => a[1] - b[1]).reverse()
  //   // return results.sort((a, b) => a.total - b.total).reverse()
  // }
  }
}

let r = new R()
r.weightedScore().getRec()
console.log(r.ratings)
