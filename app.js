import express from 'express';
import bodyParser from 'body-parser'

import {usersJSON, ratingsJSON} from './data/data';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function simEuc(userID) {
  user = usersJSON.filter(a => a.UserID == userID),
  userMovies = ratingsJSON.filter(a => a.UserID == userID)

  for (let userB of usersJSON) {
    
  }
}

/** 
 * Routing
*/
app.get('/api/ratings', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'ratings reterived sucessfully',
    ratings: ratingsJSON
  })
});

app.get('/api/ratings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.status(200).send({
    statusCode: 200,
    id: id,
    user: usersJSON.filter(a => a.UserID == id),
    ratedMovies: ratingsJSON.filter(a => a.UserID == id),
    euclidean: 
  });
});

app.get('/api/users', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'ratings reterived sucessfully',
    ratings: usersJSON
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});