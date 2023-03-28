const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';


const generateRandomString = function() {
  let output = '';
  for (let i = 0; i < 6; i++) {
    output += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return output;
};

const getUserByEmail = function(email, database) {
    let user;
    for (const keys in database) {
      for (const key in database[keys]) {
        if (database[keys].email === email) {
           user = database[keys].id;
           return user;
        }
      }
    }
  return undefined;
  };

module.exports = { generateRandomString, getUserByEmail };