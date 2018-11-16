const data = require('./data')

function euclidean (UserAID, UserBID) {
  let ratings = data.ratings
  let sim = 0
  let counter = 0
  let userAratings = []
  let userBratings = []

  // Loopar igenom alla ratings
  for (let rating of ratings) {
    // Om userA har satt be
    if (UserAID === Number(rating.UserID)) {
      userAratings.push(rating)
    }
    // Om userA har satt be
    if (UserBID === Number(rating.UserID)) {
      userBratings.push(rating)
    }
  }

  for (let ratingA of userAratings) {
    for (let ratingB of userBratings) {
      // If both users have rated the same movie
      if (ratingA.Movie === ratingB.Movie) {
        sim += ((ratingA.Rating - ratingB.Rating) ** 2)
        counter++
      }
    }
  }

  // Om inte samma film har betygsatts av A&B
  if (counter === 0) {
    return 0
  }

  return 1 / (1 + sim)
}

console.log(euclidean(2, 4))

module.exports = euclidean
