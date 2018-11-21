// Skriva up Pearson score
/**
 * API requests
*/
// import tm from './tableMaker.js'

// let Tabulator = require('tabulator-tables')
// let ScoreGenerator = require('../../weightedScore')
// import Tabulator from 'tabulator-tables'
// import ScoreGenerator from '../../weightedScore'
let ratings = null
let users = null

let testResults
// console.log(testResults)

fetch('http://localhost:5050/ratings')
  .then(res => res.json())
  .then(jsonData => {
    testResults = jsonData
    console.log(jsonData)
  })

fetch('http://localhost:5050/ratings')
  .then(res => res.json())
  .then(jsonData => {
    ratings = jsonData
  })

fetch('http://localhost:5050/users')
  .then(res => res.json())
  .then(jsonData => {
    users = jsonData
  })

// async requests
const getUsers = async () => {
  const response = await fetch('http://localhost:5050/users')
  const users = await response.json()
  return users
}

function userData (id) {
  return fetch(`http://localhost:5050/users/${id}`)
    .then((res) => {
      return res.json()
    }).then(userData => {
      // console.dir(userData.euclidean)
      // console.dir(userData.pearson)

      return userData
    })
}

// Create Selecter

function dropDown () {
  let dropdown = document.getElementById('user-dropdown')
  dropdown.length = 0

  let defaultOption = document.createElement('option')
  defaultOption.text = 'Pick User'

  dropdown.add(defaultOption)
  dropdown.selectedIndex = 0

  fetch('http://localhost:5050/users')
    .then(
      function (response) {
        if (response.status !== 200) {
          return 'Too bad'
        }

        // Examine the text in the response
        response.json().then(function (data) {
          let option

          for (let i = 0; i < data.length; i++) {
            option = document.createElement('option')
            option.text = data[i].UserName
            option.value = data[i].UserID
            dropdown.add(option)
          }
        })
      }
    )
    .catch(function (err) {
      console.error('Fetch Error -', err)
    })
}

// // TableMaker
function tableMaker (objArray, classy) {
  let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray

  let str = '<table class="' + classy + '">'

  // HEAD
  str += '<thead><tr>'
  for (let index in array[0]) {
    str += '<th scope="col">' + index + '</th>'
  }
  str += '</tr></thead>'

  // table body
  str += '<tbody>'
  for (let i = 0; i < array.length; i++) {
    str += (i % 2 == 0) ? '<tr class="alt">' : '<tr>'
    for (let index in array[i]) {
      str += '<td>' + array[i][index] + '</td>'
    }
    str += '</tr>'
  }
  str += '</tbody>'
  str += '</table>'
  return str
}

dropDown() // init dropdown data
let findButton = document.querySelector('.calcButton')

// Go time *****************************
let eucArr
let pcsArr

findButton.addEventListener('click', () => {
  let userValue = document.getElementById('user-dropdown').value
  let userDataResults = userData(userValue)
  userDataResults.then((a) => {
    let userName = a.user.UserName
    eucArr = Array.from(a.euclidean).sort((a, b) => Number(a.euclideanScore) - Number(b.euclideanScore)).reverse()
    pcsArr = Array.from(a.pearson).sort((a, b) => Number(a.pearson) - Number(b.pearson)).reverse()
    document.getElementById('user').innerHTML = userName
    // console.dir(document.getElementById('Euclidean').checked)

    if (document.getElementById('Euclidean').checked) {
      // Euclidean Print
      document.getElementById('data').innerHTML = tableMaker(eucArr)// JSON.stringify(a.euclidean)
      let similarPerson = eucArr[0].otherUser == userName ? eucArr[1].otherUser : eucArr[0].otherUser
      let theMovies = fetch(`http://localhost:5050/ratings/${a.user.UserID}`).then(res => res.json()).then(data => {
        // console.log(data.movies.ratings.sort((a, b) => a - b))
        let arr = Array.from(data.movies)
        arr.sort((a, b) => a.Rating - b.Rating).reverse()
        console.log(arr)
        for (let m of arr) {
          document.getElementById('data2').innerHTML += `${m.Movie} (${m.Rating}), `
        }

        return data.movies
      })
      console.log(theMovies.movies)

      document.getElementById('data2').innerHTML = `Similar in taste to you is ${similarPerson}
      that enjoys theses movies (From best high to low rated): `
    } else {
      document.getElementById('data').innerHTML = tableMaker(pcsArr)// Print Pearson
      document.getElementById('data2').innerHTML = ''

      let similarPerson = pcsArr[0].otherUser == userName ? pcsArr[1].otherUser : pcsArr[0].otherUser
      let theMovies = fetch(`http://localhost:5050/ratings/${a.user.UserID}`).then(res => res.json()).then(data => {
        // console.log(data.movies.ratings.sort((a, b) => a - b))
        let arr = Array.from(data.movies)
        arr.sort((a, b) => a.Rating - b.Rating).reverse()
        console.log(arr)
        for (let m of arr) {
          document.getElementById('data2').innerHTML += `${m.Movie} (${m.Rating}), `
        }

        return data.movies
      })
      console.log(theMovies.movies)

      document.getElementById('data2').innerHTML = `Similar in taste to you is ${similarPerson}
      that enjoys theses movies (From best high to low rated): `

      console.log('in pcs')
    }
    // for (let aRate of a.euclidean) {
    //   console.log(aRate)
    // }
  })

  // document.querySelector('.data-display').innerHTML = `results: ${JSON.stringify(userDataResults)}`
})
