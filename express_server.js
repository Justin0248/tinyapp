const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
console.log(urlDatabase)
const users = {

};
console.log(users)
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';


function generateRandomString() {
  let output = ''
for (let i = 0; i < 6; i++) {
output += characters.charAt(Math.floor(Math.random() * characters.length))
}
return output;
}

app.use(express.urlencoded({ extended: true }));


//shows username in create new url header
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});


//shows username in header while in edit url
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] 
  };
  res.render("urls_show", templateVars);
});


//shows username in url homepage
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});


//gives user registration page
app.get("/registration", (req, res) => {
const templateVars = {
  username: req.cookies["username"]
}
  res.render("urls_register", templateVars)
});


//redirects user to selected url
app.get("/u/:id", (req, res) => {
  const url = req.params.id
   const longURL = urlDatabase[url];
  res.redirect(longURL);
});


//page to let user register using email and password
app.post("/registration", (req, res) => {
const email = req.body.email;
const password = req.body.password;
const userID = generateRandomString()
users[userID] = {
  id: userID,
email: email,
password: password
};
res.cookie("userID", users)
res.redirect("/urls");
});


//lets user sign in/up using username
app.post("/urls", (req, res) => {
 let username = req.body["username"]
  res.cookie('username', username);
  res.redirect("/urls");
});


//lets user logout
app.post("/urls/:username", (req, res) => {
let username = req.cookies["username"];
res.clearCookie('username', username);
res.redirect("/urls");
});


//generates a random short url to associate 
//with the created url and adds it to home page
app.post("/urls/new", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL; 
  res.redirect(`/urls/${shortURL}`);
});


//lets user edit a long url without changing the short url
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  if (longURL){
  urlDatabase[id] = longURL;
  }
  res.redirect(`/urls/${id}`);
});


//lets user delete a url from the home page
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
delete urlDatabase[id];
res.redirect("/urls");
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