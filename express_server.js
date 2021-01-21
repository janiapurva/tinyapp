const express = require('express');

const app = express();

const morgan = require('morgan');

// const bcrypt = require('bcrypt');

const PORT = 8080;


// adding body parser for post request
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

/// cockie parser
const cookieParser = require('cookie-parser');

app.use(cookieParser());


//setting Ejs engine look up
app.set('view engine','ejs');

//morgan set up
app.use(morgan('dev'));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};



/// creating userdata to store
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
  
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

// filtering use and url
// eslint-disable-next-line func-style
function filterUrlsUser(userId) {
  let userUrl = {};
  for (let shortU in urlDatabase) {
    if (urlDatabase[shortU].userID === userId) {
      userUrl[shortU] = urlDatabase[shortU];
    }
  }
  return userUrl;
}




// sending data to URL.ejs
app.get('/urls' , (req,res) => {
  const id = req.cookies.newUserId;
  console.log(id);

  // return userUrlDatabase
  if (id) {
    const urlDatabase = filterUrlsUser(id);
    const user = users[id];
    const templateVars = {urls: urlDatabase, id,user};
    res.render('urls_index',templateVars);
  } else {
    
    res.send(`log in or register first`);
  }
});

// adding  Get route to Show the Form
app.get("/urls/new", (req, res) => {
  const id = req.cookies.newUserId;
  if (!id) {
    res.redirect('/login');
  } else {
    const user = users[id];
    const templateVars = {urls: urlDatabase,user};
    res.render("urls_new",templateVars);
  }
});

//adding second route and templete
app.get('/urls/:shortURL' ,(req,res) => {
  const id = req.cookies.newUserId;
  if (id) {
    const user = users[id];
    const templateVars = {shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL].longURL, user};
    res.render('urls_show',templateVars);
  } else {
    
    res.send(`log in or register first`);
  }
});

//adding route to match for post request and generating random string
app.post('/urls',(req,res) => {
  console.log(req.body);
  const id = req.cookies.newUserId;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const newId = {longURL :longURL,userID:id};
  urlDatabase[shortURL] = newId;
  res.redirect(`/urls/${shortURL}`);
});

//Generating a Rnadom  short URL
// eslint-disable-next-line func-style
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOP1234567890QRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 1; i <= 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;

}

/// redirecting with short url

// Redirect user to long URL(actual website)
// if URL exists in database


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send("No existing short URL in database...");
  }

});

//// Day 2
////adding post request routing

app.post('/urls/:shortURL/delete',(req,res)=> {
  const id = req.cookies.newUserId;
  if (id) {
    const urlDelete = req.params.shortURL;
    if (id === urlDatabase[urlDelete].userID) {
      delete urlDatabase[urlDelete];
  
      res.redirect("/urls");
    } else {
      res.send(`you can not delete url not belogs to You`);
    }
  } else {
    res.send('please First login or refgister');
  }
});


/// adding edit button
app.post('/urls/:shortURL/edit', (req,res)=> {
  const id = req.cookies.newUserId;
  if (id) {
    const moveUrl = req.params.shortURL;
    if (id === urlDatabase[moveUrl].userID) {
      res.redirect(`/urls/${moveUrl}`);

    } else {
      res.send(`you can not delete url not belogs to You`);
    }
  } else {
    res.send('please First login or register');
  }
  
});


// EDITING uRL
app.post("/urls/:shortURL", (req,res) => {
  let shorturl = req.params.shortURL;
  urlDatabase[shorturl] = req.body.editedURL;
  res.redirect("/urls");
});



/// email helper function
// eslint-disable-next-line func-style
function emailChecker(emailInput) {
  for (let person in users) {
    if (users[person]['email'] === emailInput) {
      return users[person];
    }
  }
}



// ading login route
app.post('/login',(req,res) => {
  const inputPassword = req.body.password;
  const inputemail = req.body.email;
  const resultUser = emailChecker(inputemail);
  if (resultUser === undefined || inputPassword !== resultUser.password) {
    res.redirect('/register');
  }
  let id = "";
  for (let key in users) {
    if (users[key].email === inputemail) {
      id = key;
    }
  }
  res.cookie("newUserId",id);

  res.redirect('/urls');
});

/// Display usernmae function





//// implementing log out function
app.post('/logout',(req,res) => {
  res.clearCookie("newUserId");
  
  res.redirect('/urls');

});






///// Week 3 creating Registration display templete
app.get('/register', (req,res) => {
  const id = req.cookies.newUserId;
  const user = users[id];
  const templateVars = {urls: urlDatabase,user};
  res.render('url _registration',templateVars);
});




///// creatung register object
app.post('/register', (req,res) => {
  // checking errors with empaty string
  if (req.body.email === '' || req.body.password === '' || emailChecker(req.body.email)) {
    res.status(400).send('Error');
  }

  const newUserId = generateRandomString();
  /// creating new Object
  const newUser = {
    id: newUserId,
    email: req.body.email,
    password: req.body.password,
  };
  // assiging nrew object
  users[newUserId] = newUser;
  res.cookie("newUserId",newUserId);
  res.redirect('/urls');

});

/// creating a log  page
app.get('/login',(req,res) => {
  const id = req.cookies.newUserId;
  const user = users[id];
  const templateVars = {urls: urlDatabase,user};
  res.render('user_login',templateVars);
});





//listening port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




