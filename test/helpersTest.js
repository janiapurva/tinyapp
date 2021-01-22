const { assert } = require('chai');

const {emailChecker} = require('../helpers');




const testUsers = {
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


/*Note: I have implemnted email checker function which returns full object the reason for that I have used this function to access various data like email, password and userId and it has all dependency of my project
In order to pass this test I have just added id only to access object.*/






describe('emailChecker', function() {
  it('should return a user with valid email', function() {
    const user = emailChecker("user@example.com",testUsers).id;
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(expectedOutput,user);
  });
  it('should return a undfine', function() {
    const user = emailChecker("uuuu@example.com",testUsers);
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(expectedOutput,user);
  });
});



