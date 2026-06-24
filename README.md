<p align="center">

<h1 align="center" style="margin-top: 0px;">*** Movie-API ***</h1>

</p>

A movie database API built using Express, MongoDB, and Mongoose.

## Setup and Installation

1. **Install dependencies:**
    ```bash
    npm install express morgan body-parser uuid mongoose cors express-validator passport
    ```

2. **Set up MongoDB connection:**
    - Set your MongoDB connection string as an environment variable:
        ```bash
        export CONNECTION_URI=your_mongo_connection_string
        ```

3. **Run the server:**
    ```bash
    node yourFileName.js
    ```

## Endpoints

### Welcome

- `GET /` - Welcome to MyFlix API

### Movies

- `GET /movies` - Retrieve all movies.
- `GET /movies/:title` - Get a specific movie by title. *(JWT authentication required)*
- `GET /movies/genre/:name` - Get movies by genre. *(JWT authentication required)*
- `GET /movies/director/:name` - Get movies by director. *(JWT authentication required)*

### Users

- `POST /users` - Register a new user. 
    - Fields: `username`, `password`, `email` (birthday is optional)
- `PUT /users/:username` - Update user information. *(JWT authentication required)*
- `DELETE /users/:username` - Delete a user. *(JWT authentication required)*

### Favorite Movies

- `POST /users/:username/movies/:movieName` - Add a movie to favorites. *(JWT authentication required)*
- `DELETE /users/:username/movies/:movieName` - Remove a movie from favorites. *(JWT authentication required)*

## Notes

Remember to secure sensitive data like your MongoDB connection string using environment variables or other secure methods.
