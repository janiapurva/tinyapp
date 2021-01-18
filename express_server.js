const express = require('express');

const app = express();

const PORT = 8080;

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

//listening port 
app.listen(PORT, () => {
  console.log(`Example app lsitening on port ${PORT}!`);
});
