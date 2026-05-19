const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({
      message: "Username and password required"
    });
  }

  let userExists = users.find((user) => user.username === username);

  if(userExists){
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });

});


public_users.get('/', async function (req, res) {

    try {
  
      const getBooks = new Promise((resolve, reject) => {
        resolve(books);
      });
  
      const data = await getBooks;
  
      return res.status(200).json(data);
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);

});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  let filteredBooks = {};

  Object.keys(books).forEach((key) => {

    if(books[key].author === author){
      filteredBooks[key] = books[key];
    }

  });

  return res.status(200).json(filteredBooks);

});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  let filteredBooks = {};

  Object.keys(books).forEach((key) => {

    if(books[key].title === title){
      filteredBooks[key] = books[key];
    }

  });

  return res.status(200).json(filteredBooks);

});


// Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
  
    const reviews = books[isbn].reviews;
  
    if(Object.keys(reviews).length === 0){
      return res.status(200).json({
        message: "No reviews found for this book."
      });
    }
  
    return res.status(200).json(reviews);
  
  });

  
module.exports.general = public_users;