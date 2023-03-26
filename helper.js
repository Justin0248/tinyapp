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

  module.exports = {getUserByEmail};