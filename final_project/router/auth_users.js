const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

    return users.some(user => user.username === username);
  
  }
  const authenticatedUser = (username, password) => {

    return users.some(user =>
      user.username === username && user.password === password
    );
  
  }

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
  
    let accessToken = jwt.sign(
      { username: username },
      "access",
      { expiresIn: "1h" }
    );
  
    req.session.authorization = {
      accessToken,
      username
    };
  
    return res.status(200).json({
      message: "Login successful",
      token: accessToken
    });
  
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!review) {
      return res.status(400).json({
        message: "Review is required"
      });
    }
  
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
  
    // username from session
    const username = req.session.authorization.username;
  
    // check if book exists
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    // check if user has review
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({
        message: "No review found for this user"
      });
    }
  
    // delete review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
