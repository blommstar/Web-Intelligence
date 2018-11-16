console.log('loaded')

/**
 * API requests
*/
let ratings = null
let users = null

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

function toTable (arr) {
  // var arr = JSON.parse(str) // create object
  console.log(arr)

  var html = '<table id="mytable">' // string
  html += '<tr>'
  html += '<th>' + 'UserName' + '</th>'
  html += '<th>' + 'UserID' + '</th>'
  html += '</tr>'
  for (let user of users) {
    console.dir(user)
    html += '<tr>'
    html += '<td>' + user.UserName + '</td>'
    html += '<td>' + user.UserID + '</td>'
    html += '</tr>'
  }
  html += '</table>'
  var div = document.querySelector('.data-display')
  document.body.innerHTML += html
  div.innerHTML = html + '</table>'
}
// functionality
let findButton = document.querySelector('.calcButton')

findButton.addEventListener('click', () => {
  console.log(toTable(users))
})

// Create Selecter
let dropdown = document.getElementById('user-dropdown')
dropdown.length = 0

let defaultOption = document.createElement('option')
defaultOption.text = 'Pick User'

dropdown.add(defaultOption)
dropdown.selectedIndex = 0

const url = 'http://localhost:5050/users'

fetch(url)
  .then(
    function (response) {
      if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' +
          response.status)
        return
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
