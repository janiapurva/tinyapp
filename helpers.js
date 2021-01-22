const bcrypt = require('bcrypt');

const saltRounds = 10;
/// creating userdata to store
const users = {
  "user1": {
    id: "user1",
    email: "a@a",
    password: bcrypt.hashSync("f", saltRounds)
  }
  
};


const urlDatabase = {
  'b6UTxQ': { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  'i3BoGr': { longURL: "https://www.google.ca", userID: "aJ48lW" }
};




/// email helper function
// eslint-disable-next-line func-style
function emailChecker(emailInput,users) {
  for (let person in users) {
    if (users[person]['email'] === emailInput) {
      return users[person];
    }
  }
}



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

module.exports = {emailChecker,users,generateRandomString,urlDatabase,filterUrlsUser};