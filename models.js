const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

/**
* @fileOverview Defines Movie and User Mongoose schemas and models.
* @module models
*/

/**
 * Schema for the Movie.
 * 
 * @typedef {Object} MovieSchema
 * @property {string} title - The title of the movie.
 * @property {string} description - A brief description of the movie.
 * @property {Object[]} genres - The genres of the movie.
 * @property {string} genres.name - The name of the genre.
 * @property {string} genres.description - A brief description of the genre.
 * @property {Object} director - The director of the movie.
 * @property {string} director.name - The name of the director.
 * @property {string} director.bio - A short biography of the director.
 * @property {string} imagePath - A link or path to the movie's poster image.
 * @property {boolean} featured - Indicates whether the movie is featured.
 */
let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [
        {
            name: String,
            description: String
        }
    ],
    director: {
        name: String,
        bio: String
    },
    imagePath: String,
    featured: Boolean
});

/**
 * Schema for the User.
 * 
 * @typedef {Object} UserSchema
 * @property {string} username - The user's unique username.
 * @property {string} password - The user's hashed password.
 * @property {string} email - The user's email address.
 * @property {Date} birthday - The user's date of birth.
 * @property {mongoose.Schema.Types.ObjectId[]} favoriteMovies - A list of favorite movies (references to Movie documents).
 */
let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Static method to hash a password.
 * 
 * @function
 * @param {string} password - The plain text password to hash.
 * @returns {string} - A hashed password.
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Method to validate the user's password.
 * 
 * @function
 * @param {string} password - The plain text password to validate.
 * @returns {boolean} - `true` if the password matches, otherwise `false`.
 */
// Don't use arrow functions when defining instance methods! (validatePassword is an instance method)
userSchema.methods.validatePassword = function (password) {
    console.log('password', password)
    console.log('this.password', this.password)
    return bcrypt.compareSync(password, this.password);
};

/**
 * Mongoose model for the Movie schema.
 * 
 * @type {mongoose.Model}
 */
let Movie = mongoose.model('Movie', movieSchema);

/**
 * Mongoose model for the User schema.
 * @type {mongoose.Model}
 */
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;