const data = require('./data')

class A {
  constructor (userA) {
    this.userA = userA || { UserName: 'Toby', UserID: '7' }
    this.users = data.users
    this.ratings = data.ratings
    this.test = []
  }

  euclidean (userA, userB) {
    let sim = 0
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
  }

  getRecommended () {
    let results = []
    let movies = this.ratings.map(a => a.Movie).filter((item, pos, arr) => arr.indexOf(item) == pos)
    let userAmovies = this.ratings.filter(a => a.UserID == this.userA.UserID)

    for (let movie of movies) {
      let data = {
        movie: movie,
        sumWeighted: 0,
        sumSim: 0,
        getTotal () {
          return this.sumWeighted / this.sumSim
        }
      }

      for (let user of this.users) { // Find SIMSCORE for movie and add to data
        if (user.UserID == this.userA.UserID) continue // removes userA
        let eucScore = this.euclidean(this.userA, user) // EucScore for current user *
        for (let rated of this.ratings) { // Add all weighted scored to SUMWEIGHTED
          if (rated.Movie == movie && rated.UserID == user.UserID) { // calculte weighted (Rating * simScore)
            data.sumWeighted += Number(rated.Rating) * eucScore
            data.sumSim += eucScore
          }
        }
      }
      results.push([data.movie, data.getTotal()])
    }

    // Removes the movies userA already seen
    let rec = results.filter((c, i, a) => {
      if (userAmovies.find(e => e.Movie == c[0])) {
        return null
      } else return c
    }).sort((a, b) => b[1] - a[1])

    return rec
    // return results.sort((a, b) => b[1] - a[1])
  }
}
let a = new A()
console.log(a.getRecommended())

module.exports = A
