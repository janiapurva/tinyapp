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

//adding route to match for post request and generating random string
app.post('/urls',(req,res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(`${res.statusCode} ok `);
  res.send('ok');
});

//Generating a Rnadom  short URL
// eslint-disable-next-line func-style
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 1; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;

}

//listening port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

