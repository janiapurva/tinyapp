const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cookieSession = require("cookie-session");

const {
  emailChecker,
  users,
  generateRandomString,
  urlDatabase,
  filterUrlsUser,
} = require("./helpers.js");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const PORT = 8080;

// adding body parser for post request
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

/// cockie parser
const cookieParser = require("cookie-parser");

app.use(cookieParser());

//setting Ejs engine look up
app.set("view engine", "ejs");

//morgan set up
app.use(morgan("dev"));

// creating homePage request
app.get("/", (req, res) => {
  res.send("Hello!");
});

// adding routes
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Sending HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// sending data to URL.ejs
app.get("/urls", (req, res) => {
  const id = req.session.newUserId;
  // return userUrlDatabase
  if (id) {
    const urlDatabase = filterUrlsUser(id);
    const user = users[id];
    const templateVars = { urls: urlDatabase, id, user };
    res.render("urls_index", templateVars);
  } else {
    res.send(`log in or register first`);
  }
});

// adding  Get route to Show the Form
app.get("/urls/new", (req, res) => {
  const id = req.session.newUserId;
  if (!id) {
    res.redirect("/login");
  } else {
    const user = users[id];
    const templateVars = { urls: urlDatabase, user };
    res.render("urls_new", templateVars);
  }
});

//adding second route and templete
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.newUserId;
  if (id) {
    const user = users[id];
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user,
    };
    res.render("urls_show", templateVars);
  } else {
    res.send(`log in or register first`);
  }
});

//adding route to match for post request and generating random string
app.post("/urls", (req, res) => {
  const id = req.session.newUserId;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const newId = { longURL: longURL, userID: id };
  urlDatabase[shortURL] = newId;
  res.redirect(`/urls/${shortURL}`);
});

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

////adding post request routing

app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.newUserId;
  if (id) {
    const urlDelete = req.params.shortURL;
    if (id === urlDatabase[urlDelete].userID) {
      delete urlDatabase[urlDelete];

      res.redirect("/urls");
    } else {
      res.send(`you can not delete url not belogs to You`);
    }
  } else {
    res.send("please First login or refgister");
  }
});

/// post request for edit
app.post("/urls/:shortURL/edit", (req, res) => {
  const id = req.session.newUserId;
  if (!id) {
    return res.send("Please First login or register");
  }
  const moveUrl = req.params.shortURL;
  if (id !== urlDatabase[moveUrl].userID) {
    return res.redirect("/urls");
  }
  const shorturl = req.params.shortURL;
  urlDatabase[shorturl].longURL = req.body.editedURL;
  return res.redirect("/urls");
});



// ading login route
app.post("/login", (req, res) => {
  const inputPassword = req.body.password;
  const inputemail = req.body.email;
  const resultUser = emailChecker(inputemail, users);
  if (
    resultUser === undefined ||
    !bcrypt.compareSync(inputPassword, resultUser.password)
  ) {
    res.redirect("/register");
  }
  let id = "";
  for (let key in users) {
    if (users[key].email === inputemail) {
      id = key;
    }
  }
  req.session.newUserId = id;

  res.redirect("/urls");
});

//// implementing log out function
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

///// Week 3 creating Registration display templete
app.get("/register", (req, res) => {
  const id = req.session.newUserId;
  const user = users[id];
  const templateVars = { urls: urlDatabase, user };
  res.render("url _registration", templateVars);
});

///// creatung register object
app.post("/register", (req, res) => {
  // checking errors with empaty string
  if (
    req.body.email === "" ||
    req.body.password === "" ||
    emailChecker(req.body.email, users)
  ) {
    res.send("Error");
  }

  const newUserId = generateRandomString();
  /// creating new Object
  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  const newUser = {
    id: newUserId,
    email: req.body.email,
    password: hashedPassword,
  };
  // assiging new object
  users[newUserId] = newUser;
  req.session.newUserId = newUserId;
  res.redirect("/urls");
});

/// creating a log  page
app.get("/login", (req, res) => {
  const id = req.session.newUserId;
  const user = users[id];
  const templateVars = { urls: urlDatabase, user };
  res.render("user_login", templateVars);
});

//listening port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
