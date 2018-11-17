const data = require('./data')

function pearson (UserAID, UserBID) {
  let ratings = data.ratings
  let sum1 = 0
  let sum2 = 0
  let sum1sq = 0
  let sum2sq = 0
  let pSum = 0
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
        let rA = Number(ratingA.Rating)
        let rB = Number(ratingB.Rating)
        sum1 += rA
        sum2 += rB
        sum1sq += rA ** 2
        sum2sq += rB ** 2
        pSum += rA * rB
        counter++
      }
    }
  }

  if (counter === 0) {
    return 0
  }
  let num = pSum - (sum1 * sum2 / counter)
  let den = Math.sqrt((sum1sq - sum1 ** 2 / counter) * (sum2sq - sum2 ** 2 / counter))
  return num / den
}

function checkAgainstAll (user) {
  let users = data.users
  let result = []
  for (let otherUser of users) {
    let pearsonResultObject = {
      otherUser: otherUser.UserName,
      pearson: pearson(Number(user), Number(otherUser.UserID))
    }
    result.push(pearsonResultObject)
  }
  return result
}

module.exports = {
  pearson: pearson,
  checkAgainstAll: checkAgainstAll
}
