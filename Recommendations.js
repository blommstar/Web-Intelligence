const data = require('./data')

class Recommendations {
  constructor (userA) {
    this.userA = userA
    this.users = data.users
    this.ratings = data.ratings
    this.dataTable = []
    this.recommendations = []

    this.weightedScores(userA)
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
    // console.log((1 / (1 + Math.sqrt(simScore))), simScore, '*****************')
    return 1 / (1 + Math.sqrt(simScore))
  }

  pearson () {

  }

  weightedScores (userA) {
    for (let userB of this.users) {
      let dataLine = {
        user: userB,
        simScore: this.euclidean(userA, userB),
        ratingResults: []
      }

      // Loopa alla filmer för användare B och multiplicera dessa med simscore
      for (let movie of this.ratings) {
        if (userB.UserID == movie.UserID) {
          dataLine.ratingResults.push({ movie: movie, weightedScore: (movie.Rating * dataLine.simScore) })
          // dataLine.ratingResults.push([ movie.Movie, (movie.Rating * dataLine.simScore) ])
        }
      }
      // // Multiplicera ihop summan av alla simScore
      // for (let result of dataLine.ratingResults) {
      //   dataLine.totalSim += result.weightedScore
      //   // dataLine.totalSim += result[1]
      // }
      this.dataTable.push(dataLine)
    }
    return this
  }

  getRecommendations () {
    let recommendedMovies = []
    for (let movie of this.ratings) {
      if (this.userA.UserID == movie.UserID) { // om filmen har betygsatts av userA -> add to sumMatchedSim

      }
    }
    for (let line of this.dataTable) {
      for (let ratedMovie of Array.from(line.ratingResults)) {
        if (line.simScore) {
          line.sumMatchedSim += line.simScore
        }
        // console.log(line.simScore)
        // console.log(ratedMovie)
        // console.log(ratedMovie.movie.Movie)
        // console.log(ratedMovie.weightedScore)
        this.recommendations.push({ movie: ratedMovie.movie.Movie, score: (line.totalSim / line.sumMatchedSim) })
      }
      // console.log(line)
    }
    return this
  }
  getRec () {
    for (let movie of this.ratings) { // alla filmer
      if (movie.UserID == this.userA.UserID) { // userA filmer
        let recMov = { // Rekommendationsobjekt
          movie: movie.Movie,
          total: 0,
          sumSim: 0,
          movieScore: 0
        }
        for (let userB of this.dataTable) { // Få det viktade score från övriga
          for (let ratedMovie of Array.from(userB.ratingResults)) {
            if (ratedMovie.movie.Movie == movie.Movie) {
              recMov.total += ratedMovie.weightedScore
              recMov.sumSim += userB.simScore
            }
          }
          recMov.movieScore = (recMov.total / recMov.sumSim)
          this.recommendations.push(recMov)
        }
      }
    }// All filmer loopen slutar
  }
}

let aa = new Recommendations({ UserName: 'Lisa', UserID: '1' })
// aa.euclidean({ UserName: 'Lisa', UserID: '1' }, { UserName: 'Bluttan', UserID: '2' })
aa.getRec()

console.log(aa.recommendations)
