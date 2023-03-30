const express = require("express");
const cookieSession = require('cookie-session');
const { generateRandomString ,getUserByEmail } = require('./database/functions');
const { urlDatabase, users} = require('./database/data');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080



app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],
}));

app.use(express.urlencoded({ extended: true }));






//login function
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const uid = getUserByEmail(email, users);
  for (const keys in users) {
    if (users[keys].email === email) {
  if (uid && bcrypt.compareSync(password, users[uid].hashedPassword)) {
        const id = users[keys].id;
        req.session.email = email;
        req.session.hashedPassword = users[uid].hashedPassword;
        req.session.id = id;
        res.redirect("/urls");
        return 0;
      }
    }
  }
  res.status(403).send('Error, wrong information provided');
  return 0;
});
  
//registration function
app.post("/registration", (req, res) => {
  let id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  for (const keys in users) {
    for (const key in users[keys]) {
      if (users[keys][key] === email) {
        res.status(400).send('Error, Email already taken');
        return 0;
      }
    }
  }
  if (!email || !password) {
    res.status(400).send('Error, insufficient information provided');
  } else if (email && password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = {
      id,
      email: email,
      hashedPassword: hashedPassword
    };
    req.session.email = email;
    req.session.hashedPassword = hashedPassword;
    req.session.id = id;
    res.redirect("/urls");
  }
});


//generates a random short url to associate
//with the created url and adds it to home page
app.post("/urls/new", (req, res) => {
  const longURL = req.body.longURL;
  const ids = req.session.id;
  if (longURL) {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: longURL,
      userID: ids,
    };
    res.redirect(`/urls/${id}`);
  }
});


//lets user edit a long url without changing the short url
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const longURL = req.params.longURL
  const eLongURL = req.body.eLongURL;
  if (eLongURL) {
    urlDatabase[id].longURL = eLongURL;
  }
  res.redirect(`/urls/${id}`);
});


// logout function
app.post("/urls", (req, res) => {
  let email = req.session.email;
  let password = req.session.password;
  if (email) {
    req.session = null;
    res.redirect("/login");
    return 0;
  }
});


//lets user delete a url from the home page, only if they created the url
app.post("/urls/:id/delete", (req, res) => {
  const uid = req.session.id;
  const urls = urlDatabase;
  const id = req.params.id;
  for (key in urls) {
    if (uid !== urls[key].userID && key === id) {
      res.status(400).send('you do not have permissions to access this information, please login with the associated account')
      return 0;
    }
  }
  delete urlDatabase[id];
  res.redirect("/urls");
  return 0;
});


//gives user the page to create a new url
app.get("/urls/new", (req, res) => {
  const email = req.session.email;
  if (!email) {
    res.status(400).send('you need to sign in to create a short url');
    return 0;
  }
  const templateVars = {
    user: users,
    urls: urlDatabase,
    email,
  };
  res.render("urls_new", templateVars);
});


//gives user edit page for selected url, only if they made the url
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(400).send('url does not exist');
    return 0;
  }
  const urls = urlDatabase;
  const uid = req.session.id;

  for (key in urls) {
    if (uid !== urls[key].userID && key === id) {
      res.status(400).send('you do not have permissions to access this information, please login with the associated account')
    }
  }
  const templateVars = {
    id: id,
    urls,
    user: users,
    email: req.session.email,
    genid: uid
  };
  res.render("urls_show", templateVars);
});


//gives user homepage if they are signed in
app.get("/urls", (req, res) => {
  email = req.session.email;
  if (!email) {
    res.status(400).send('please login first');
    return 0;
  }
  const templateVars = {
    urls: urlDatabase,
    user: users,
    email: email,
    genid: req.session.id
  };
  res.render("urls_index", templateVars);
});


//gives user the login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users,
    url: urlDatabase,
    email: req.session.email,
    password: req.session.password
  };

  res.render("urls_login", templateVars);
});


//gives user registration page
app.get("/registration", (req, res) => {
  const templateVars = {
    user: users,
    url: urlDatabase,
    email: req.session.email
  };
  res.render("urls_register", templateVars);
});


//redirects user to selected url
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if(id) {
  res.redirect(urlDatabase[id].longURL);
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



