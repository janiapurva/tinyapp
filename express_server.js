const express = require('express');

const app = express();

const PORT = 8080;

// adding body parser for post request
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//setting Ejs engine look up
app.set('view engine','ejs');

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xk" :  "http://www.google.com"
};

// creating homePage request
app.get('/', (req,res) => {
  res.send('Hello!');
});

// adding routes
app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

// Sending HTML
app.get('/hello', (req,res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// sending data to URL.ejs
app.get('/urls' , (req,res) => {
  const templateVars = {urls: urlDatabase};
  res.render('urls_index',templateVars);
});

// adding  Get route to Show the Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//adding second route and templete
app.get('/urls/:shortURL' ,(req,res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL]};
  res.render('urls_show',templateVars);
});


//listening port
app.listen(PORT, () => {
  console.log(`Example app lsitening on port ${PORT}!`);
});

