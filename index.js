const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Add a user (create)
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', passport.authenticate('jwt', (req, res) => {
    Users.findOne({ username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send('User ' + req.body.Username + ' already exists');
            } else {
                Users.create(
                    {
                        username: req.body.Username,
                        password: req.body.Password,
                        email: req.body.Email,
                        birthday: req.body.Birthday
                    }
                )
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Get all users
app.get('/users', passport.authenticate('jwt', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', (req, res) => {
    Users.findOne(
        { username: req.params.Username }
    )
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:Movietitle', passport.authenticate('jwt', (req, res) => {
    Movies.findOne(
        { title: req.params.Movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.Username },
                { $push: { favoriteMovies: movie._id } },
                // return the updated object
                { new: true }
            )
                .then((user) => {
                    res.json(user);
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Remove a movie to a user's list of favorites
app.delete('/users/:Username/movies/:Movietitle', passport.authenticate('jwt', (req, res) => {
    Movies.findOne(
        { title: req.params.Movietitle }
    )
        .then((movie) => {
            Users.findOneAndUpdate(
                { username: req.params.Username },
                { $pull: { "favoriteMovies": movie._id } },
                // return the updated object
                { new: true }
            )
                .then((user) => {
                    res.json(user);
                })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', (req, res) => {
    Users.findOneAndRemove({ username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', (req, res) => {
    Users.findOneAndUpdate(
        { username: req.params.Username },
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday,
                favoriteMovies: req.body.favoriteMovies,
            }
        },
        // return the updated object
        { new: true }
    )
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie-API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', (req, res) => {
    Movies.findOne(
        { title: req.params.Title }
    )
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Get data about a genre by genreName
app.get('/movies/genres/:GenreName', passport.authenticate('jwt', (req, res) => {
    Movies.findOne(
        { "genres.name": req.params.GenreName }
    )
        .then((movie) => {
            res.json(movie.genres);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', (req, res) => {
    Movies.findOne(
        { "director.name": req.params.directorName }
    )
        .then((movie) => {
            res.json(movie.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});