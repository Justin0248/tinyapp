const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(cookieParser());

const urlDatabase = {

};
const users = {
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';


function generateRandomString() {
  let output = ''
for (let i = 0; i < 6; i++) {
output += characters.charAt(Math.floor(Math.random() * characters.length))
}
return output;
}

app.use(express.urlencoded({ extended: true }));








//login page
app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
    for (const keys in users) {
        if(users[keys].email !== email || users[keys].password !== password) {
          res.status(403).send('Error, wrong information provided')
        }
        else if (users[keys].email === email && users[keys].password === password) {
          res.cookie('email', email);
          res.cookie('password', password);
          res.cookie('id', id)
          res.redirect("/urls");
        }
      }
  });
  
  
  //registration page
  app.post("/registration", (req, res) => {
    let id = generateRandomString();
    const email = req.body.email;
    const password = req.body.password;
    for (const keys in users) {
      for (const key in users[keys]) {
  if (users[keys][key] === email) {
    res.status(400).send('Error, Email already taken')
  }
    }
  }
    if (!email || !password) {
      res.status(400).send('Error, insufficient information provided')
    }
    else if (email && password) {
  users[id] = {
  id,
  email: email,
  password: password
  }
  console.log(users);
  res.cookie('email', email);
  res.cookie('password', password);
  res.cookie('id', id);
  res.redirect("/urls");
  }

  });


//generates a random short url to associate 
//with the created url and adds it to home page
app.post("/urls/new", (req, res) => {
  const longURL = req.body.longURL;
  userid = req.cookies['id']
  if (longURL) {
    const id = generateRandomString();
    urlDatabase[id] = { 
      longURL: longURL,
    userID: userid,
    };
    console.log(urlDatabase);
    res.redirect(`/urls`);
  }
});


//lets user edit a long url without changing the short url
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const eLongURL = req.body.eLongURL;
  if (eLongURL){
  urlDatabase[id] = eLongURL;
  }
  res.redirect(`/urls/${id}`);
});


// logout function
app.post("/urls", (req, res) => {
 let email = req.cookies["email"];
 let password = req.cookies['password'];
 let id = req.cookies['id'];
 if (email) {
  res.clearCookie('email', email);
  res.clearCookie('password', password);
  res.clearCookie('id', id)
  res.redirect("/urls");
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
  const email = req.cookies['email']
  if (!email) {
res.status(400).send('you need to sign in to create a short url')
  }
  const templateVars = {
    user: users,
    urls: urlDatabase,
    email: req.cookies['email']
  }
  res.render("urls_new", templateVars);
});


//shows username in header while in edit url
app.get("/urls/:id", (req, res) => {
  id = req.params.id
    if (!urlDatabase[id]) {
      res.status(400).send('url does not exist');
  }

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users,
    email: req.cookies['email']
  };
  res.render("urls_show", templateVars);
});


//shows username in url homepage
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users,
    email: req.cookies['email']
  };
  res.render("urls_index", templateVars);
});


app.get("/login", (req, res) => {
const templateVars = {
    user: users,
    url: urlDatabase,
    email: req.cookies['email'],
    password: req.cookies['password']
};

  res.render("urls_login", templateVars)
});


//gives user registration page
app.get("/registration", (req, res) => {
  const templateVars = {
  user: users,
  url: urlDatabase,
  email: req.cookies['email']
};
  res.render("urls_register", templateVars)
});


//redirects user to selected url
app.get("/u/:id", (req, res) => {
  const url = req.params.id
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