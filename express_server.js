const express = require("express");
const cookieSession = require('cookie-session')
const {getUserByEmail} = require('./helper')
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['secret', 'adsfgiuhawef'],
}))

const urlDatabase = {

};
const users = {
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';


const generateRandomString = function() {
  let output = '';
  for (let i = 0; i < 6; i++) {
    output += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return output;
};


app.use(express.urlencoded({ extended: true }));








//login page
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = req.session.hashedPassword
  const uid = getUserByEmail(email, users)
if (uid && bcrypt.compareSync(password, hashedPassword)) {
  for (const keys in users) {
    if (users[keys].email === email && users[keys].password === password) {
      const id = users[keys].id;
      console.log(users);
      req.session.email = email
      // res.cookie('email', email);
      req.session.hashedPassword = hashedPassword
      // res.cookie('hashedPassword', hashedPassword);
      req.session.id = id
      // res.cookie('id', id);
      res.redirect("/urls");
    }
  }
}
  res.status(403).send('Error, wrong information provided');
});
  
  
//registration page
app.post("/registration", (req, res) => {
  let id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  for (const keys in users) {
    for (const key in users[keys]) {
      if (users[keys][key] === email) {
        res.status(400).send('Error, Email already taken');
      }
    }
  }
  if (!email || !password) {
    res.status(400).send('Error, insufficient information provided');
  } else if (email && password) {
    const hashedPassword = bcrypt.hashSync(password, 10)
    users[id] = {
      id,
      email: email,
      password: password
    };
    req.session.email = email
    // res.cookie('email', email);
    req.session.hashedPassword = hashedPassword
    // res.cookie('hashedPassword', hashedPassword);
    req.session.id = id
    // res.cookie('id', id);
    res.redirect("/urls");
  }

});


//generates a random short url to associate
//with the created url and adds it to home page
app.post("/urls/new", (req, res) => {
  const longURL = req.body.longURL;
  const ids = req.session.id
  if (longURL) {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: longURL,
      userID: ids,
    };
    console.log(urlDatabase);
    res.redirect(`/urls`);
  }
});


//lets user edit a long url without changing the short url
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const eLongURL = req.body.eLongURL;
  if (eLongURL) {
    urlDatabase[id] = eLongURL;
  }
  res.redirect(`/urls/${id}`);
});


// logout function
app.post("/urls", (req, res) => {
  let email = req.session.email;
  let password = req.session.password;
  if (email) {
    req.session.email = undefined;
    // res.clearCookie('email', email);
    req.session.password = undefined;
    // res.clearCookie('password', password);
    res.redirect("/login");
  }
});


//lets user delete a url from the home page
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});


//shows username in create new url header
app.get("/urls/new", (req, res) => {
  const email = req.session.email;
  if (!email) {
    res.status(400).send('you need to sign in to create a short url');
  }
  const templateVars = {
    user: users,
    urls: urlDatabase,
    email,
  };
  res.render("urls_new", templateVars);
});


//shows username in header while in edit url
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(400).send('url does not exist');
  }
const urls = urlDatabase;
const uid = req.session.id

for (key in urls) {
  if (uid !== urls[key].userID) {
    res.redirect('/urls')
  }
}
  const templateVars = {
    id,
    urls,
    user: users,
    email: req.session.email,
    genid: uid
  };
  res.render("urls_show", templateVars);
});


//shows username in url homepage
app.get("/urls", (req, res) => {
  email = req.session.email;
  if (!email) {
    res.status(400).send('please login first')
  }
  const templateVars = {
    urls: urlDatabase,
    user: users,
    email: email,
    genid: req.session.id
  };
  res.render("urls_index", templateVars);
});


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
  const url = req.params.id;
  const longURL = urlDatabase[url];
  res.redirect(longURL);
});




//test function
app.get("/", (req, res) => {
  res.send("Hello!");
});

//test function
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});




  
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});